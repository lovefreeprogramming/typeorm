"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQueryBuilder = void 0;
const CockroachDriver_1 = require("../0201-driver/cockroachdb/CockroachDriver");
const SapDriver_1 = require("../0201-driver/sap/SapDriver");
const QueryBuilder_1 = require("./QueryBuilder");
const SqlServerDriver_1 = require("../0201-driver/sqlserver/SqlServerDriver");
const PostgresDriver_1 = require("../0201-driver/postgres/PostgresDriver");
const EntityMetadata_1 = require("../0103-metadata/EntityMetadata");
const UpdateResult_1 = require("./result/UpdateResult");
const ReturningStatementNotSupportedError_1 = require("../0402-error/ReturningStatementNotSupportedError");
const ReturningResultsEntityUpdator_1 = require("./ReturningResultsEntityUpdator");
const SqljsDriver_1 = require("../0201-driver/sqljs/SqljsDriver");
const MysqlDriver_1 = require("../0201-driver/mysql/MysqlDriver");
const BroadcasterResult_1 = require("../0108-subscriber/BroadcasterResult");
const AbstractSqliteDriver_1 = require("../0201-driver/sqlite-abstract/AbstractSqliteDriver");
const LimitOnUpdateNotSupportedError_1 = require("../0402-error/LimitOnUpdateNotSupportedError");
const OracleDriver_1 = require("../0201-driver/oracle/OracleDriver");
const UpdateValuesMissingError_1 = require("../0402-error/UpdateValuesMissingError");
const EntityColumnNotFound_1 = require("../0402-error/EntityColumnNotFound");
const AuroraDataApiDriver_1 = require("../0201-driver/aurora-data-api/AuroraDataApiDriver");
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
class UpdateQueryBuilder extends QueryBuilder_1.QueryBuilder {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connectionOrQueryBuilder, queryRunner) {
        super(connectionOrQueryBuilder, queryRunner);
        this.expressionMap.aliasNamePrefixingEnabled = false;
    }
    // -------------------------------------------------------------------------
    // Public Implemented Methods
    // -------------------------------------------------------------------------
    /**
     * Gets generated sql query without parameters being replaced.
     */
    getQuery() {
        let sql = this.createUpdateExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        return sql.trim();
    }
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    async execute() {
        const queryRunner = this.obtainQueryRunner();
        let transactionStartedByUs = false;
        try {
            // start transaction if it was enabled
            if (this.expressionMap.useTransaction === true && queryRunner.isTransactionActive === false) {
                await queryRunner.startTransaction();
                transactionStartedByUs = true;
            }
            // call before updation methods in listeners and subscribers
            if (this.expressionMap.callListeners === true && this.expressionMap.mainAlias.hasMetadata) {
                const broadcastResult = new BroadcasterResult_1.BroadcasterResult();
                queryRunner.broadcaster.broadcastBeforeUpdateEvent(broadcastResult, this.expressionMap.mainAlias.metadata);
                if (broadcastResult.promises.length > 0)
                    await Promise.all(broadcastResult.promises);
            }
            // if update entity mode is enabled we may need extra columns for the returning statement
            const returningResultsEntityUpdator = new ReturningResultsEntityUpdator_1.ReturningResultsEntityUpdator(queryRunner, this.expressionMap);
            if (this.expressionMap.updateEntity === true &&
                this.expressionMap.mainAlias.hasMetadata &&
                this.expressionMap.whereEntities.length > 0) {
                this.expressionMap.extraReturningColumns = returningResultsEntityUpdator.getUpdationReturningColumns();
            }
            // execute update query
            const [sql, parameters] = this.getQueryAndParameters();
            const updateResult = new UpdateResult_1.UpdateResult();
            const result = await queryRunner.query(sql, parameters);
            const driver = queryRunner.connection.driver;
            if (driver instanceof PostgresDriver_1.PostgresDriver) {
                updateResult.raw = result[0];
                updateResult.affected = result[1];
            }
            else {
                updateResult.raw = result;
            }
            // if we are updating entities and entity updation is enabled we must update some of entity columns (like version, update date, etc.)
            if (this.expressionMap.updateEntity && this.expressionMap.mainAlias.hasMetadata &&
                this.expressionMap.whereEntities.length > 0) {
                await returningResultsEntityUpdator.update(updateResult, this.expressionMap.whereEntities);
            }
            // call after updation methods in listeners and subscribers
            if (this.expressionMap.callListeners && this.expressionMap.mainAlias.hasMetadata) {
                const broadcastResult = new BroadcasterResult_1.BroadcasterResult();
                queryRunner.broadcaster.broadcastAfterUpdateEvent(broadcastResult, this.expressionMap.mainAlias.metadata);
                if (broadcastResult.promises.length > 0)
                    await Promise.all(broadcastResult.promises);
            }
            // close transaction if we started it
            if (transactionStartedByUs)
                await queryRunner.commitTransaction();
            return updateResult;
        }
        catch (error) {
            // rollback transaction if we started it
            if (transactionStartedByUs) {
                try {
                    await queryRunner.rollbackTransaction();
                }
                catch (rollbackError) { }
            }
            throw error;
        }
        finally {
            if (queryRunner !== this.queryRunner) { // means we created our own query runner
                await queryRunner.release();
            }
            if (this.connection.driver instanceof SqljsDriver_1.SqljsDriver && !queryRunner.isTransactionActive) {
                await this.connection.driver.autoSave();
            }
        }
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Values needs to be updated.
     */
    set(values) {
        this.expressionMap.valuesSet = values;
        return this;
    }
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    where(where, parameters) {
        this.expressionMap.wheres = []; // don't move this block below since computeWhereParameter can add where expressions
        const condition = this.computeWhereParameter(where);
        if (condition)
            this.expressionMap.wheres = [{ type: "simple", condition: condition }];
        if (parameters)
            this.setParameters(parameters);
        return this;
    }
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andWhere(where, parameters) {
        this.expressionMap.wheres.push({ type: "and", condition: this.computeWhereParameter(where) });
        if (parameters)
            this.setParameters(parameters);
        return this;
    }
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orWhere(where, parameters) {
        this.expressionMap.wheres.push({ type: "or", condition: this.computeWhereParameter(where) });
        if (parameters)
            this.setParameters(parameters);
        return this;
    }
    /**
     * Adds new AND WHERE with conditions for the given ids.
     */
    whereInIds(ids) {
        return this.where(this.createWhereIdsExpression(ids));
    }
    /**
     * Adds new AND WHERE with conditions for the given ids.
     */
    andWhereInIds(ids) {
        return this.andWhere(this.createWhereIdsExpression(ids));
    }
    /**
     * Adds new OR WHERE with conditions for the given ids.
     */
    orWhereInIds(ids) {
        return this.orWhere(this.createWhereIdsExpression(ids));
    }
    /**
     * Optional returning/output clause.
     */
    output(output) {
        return this.returning(output);
    }
    /**
     * Optional returning/output clause.
     */
    returning(returning) {
        // not all databases support returning/output cause
        if (!this.connection.driver.isReturningSqlSupported())
            throw new ReturningStatementNotSupportedError_1.ReturningStatementNotSupportedError();
        this.expressionMap.returning = returning;
        return this;
    }
    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    orderBy(sort, order = "ASC", nulls) {
        if (sort) {
            if (sort instanceof Object) {
                this.expressionMap.orderBys = sort;
            }
            else {
                if (nulls) {
                    this.expressionMap.orderBys = { [sort]: { order, nulls } };
                }
                else {
                    this.expressionMap.orderBys = { [sort]: order };
                }
            }
        }
        else {
            this.expressionMap.orderBys = {};
        }
        return this;
    }
    /**
     * Adds ORDER BY condition in the query builder.
     */
    addOrderBy(sort, order = "ASC", nulls) {
        if (nulls) {
            this.expressionMap.orderBys[sort] = { order, nulls };
        }
        else {
            this.expressionMap.orderBys[sort] = order;
        }
        return this;
    }
    /**
     * Sets LIMIT - maximum number of rows to be selected.
     */
    limit(limit) {
        this.expressionMap.limit = limit;
        return this;
    }
    /**
     * Indicates if entity must be updated after update operation.
     * This may produce extra query or use RETURNING / OUTPUT statement (depend on database).
     * Enabled by default.
     */
    whereEntity(entity) {
        if (!this.expressionMap.mainAlias.hasMetadata)
            throw new Error(`.whereEntity method can only be used on queries which update real entity table.`);
        this.expressionMap.wheres = [];
        const entities = entity instanceof Array ? entity : [entity];
        entities.forEach(entity => {
            const entityIdMap = this.expressionMap.mainAlias.metadata.getEntityIdMap(entity);
            if (!entityIdMap)
                throw new Error(`Provided entity does not have ids set, cannot perform operation.`);
            this.orWhereInIds(entityIdMap);
        });
        this.expressionMap.whereEntities = entities;
        return this;
    }
    /**
     * Indicates if entity must be updated after update operation.
     * This may produce extra query or use RETURNING / OUTPUT statement (depend on database).
     * Enabled by default.
     */
    updateEntity(enabled) {
        this.expressionMap.updateEntity = enabled;
        return this;
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates UPDATE express used to perform insert query.
     */
    createUpdateExpression() {
        const valuesSet = this.getValueSet();
        const metadata = this.expressionMap.mainAlias.hasMetadata ? this.expressionMap.mainAlias.metadata : undefined;
        // prepare columns and values to be updated
        const updateColumnAndValues = [];
        const newParameters = {};
        let parametersCount = this.connection.driver instanceof MysqlDriver_1.MysqlDriver ||
            this.connection.driver instanceof AuroraDataApiDriver_1.AuroraDataApiDriver ||
            this.connection.driver instanceof OracleDriver_1.OracleDriver ||
            this.connection.driver instanceof AbstractSqliteDriver_1.AbstractSqliteDriver ||
            this.connection.driver instanceof SapDriver_1.SapDriver
            ? 0 : Object.keys(this.expressionMap.nativeParameters).length;
        if (metadata) {
            EntityMetadata_1.EntityMetadata.createPropertyPath(metadata, valuesSet).forEach(propertyPath => {
                // todo: make this and other query builder to work with properly with tables without metadata
                const columns = metadata.findColumnsWithPropertyPath(propertyPath);
                if (columns.length <= 0) {
                    throw new EntityColumnNotFound_1.EntityColumnNotFound(propertyPath);
                }
                columns.forEach(column => {
                    if (!column.isUpdate) {
                        return;
                    }
                    const paramName = "upd_" + column.databaseName;
                    //
                    let value = column.getEntityValue(valuesSet);
                    if (column.referencedColumn && value instanceof Object) {
                        value = column.referencedColumn.getEntityValue(value);
                    }
                    else if (!(value instanceof Function)) {
                        value = this.connection.driver.preparePersistentValue(value, column);
                    }
                    // todo: duplication zone
                    if (value instanceof Function) { // support for SQL expressions in update query
                        updateColumnAndValues.push(this.escape(column.databaseName) + " = " + value());
                    }
                    else if (this.connection.driver instanceof SapDriver_1.SapDriver && value === null) {
                        updateColumnAndValues.push(this.escape(column.databaseName) + " = NULL");
                    }
                    else {
                        if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
                            value = this.connection.driver.parametrizeValue(column, value);
                            // } else if (value instanceof Array) {
                            //     value = new ArrayParameter(value);
                        }
                        if (this.connection.driver instanceof MysqlDriver_1.MysqlDriver ||
                            this.connection.driver instanceof AuroraDataApiDriver_1.AuroraDataApiDriver ||
                            this.connection.driver instanceof OracleDriver_1.OracleDriver ||
                            this.connection.driver instanceof AbstractSqliteDriver_1.AbstractSqliteDriver ||
                            this.connection.driver instanceof SapDriver_1.SapDriver) {
                            newParameters[paramName] = value;
                        }
                        else {
                            this.expressionMap.nativeParameters[paramName] = value;
                        }
                        let expression = null;
                        if ((this.connection.driver instanceof MysqlDriver_1.MysqlDriver || this.connection.driver instanceof AuroraDataApiDriver_1.AuroraDataApiDriver) && this.connection.driver.spatialTypes.indexOf(column.type) !== -1) {
                            const useLegacy = this.connection.driver.options.legacySpatialSupport;
                            const geomFromText = useLegacy ? "GeomFromText" : "ST_GeomFromText";
                            if (column.srid != null) {
                                expression = `${geomFromText}(${this.connection.driver.createParameter(paramName, parametersCount)}, ${column.srid})`;
                            }
                            else {
                                expression = `${geomFromText}(${this.connection.driver.createParameter(paramName, parametersCount)})`;
                            }
                        }
                        else if (this.connection.driver instanceof PostgresDriver_1.PostgresDriver && this.connection.driver.spatialTypes.indexOf(column.type) !== -1) {
                            if (column.srid != null) {
                                expression = `ST_SetSRID(ST_GeomFromGeoJSON(${this.connection.driver.createParameter(paramName, parametersCount)}), ${column.srid})::${column.type}`;
                            }
                            else {
                                expression = `ST_GeomFromGeoJSON(${this.connection.driver.createParameter(paramName, parametersCount)})::${column.type}`;
                            }
                        }
                        else {
                            expression = this.connection.driver.createParameter(paramName, parametersCount);
                        }
                        updateColumnAndValues.push(this.escape(column.databaseName) + " = " + expression);
                        parametersCount++;
                    }
                });
            });
            if (metadata.versionColumn)
                updateColumnAndValues.push(this.escape(metadata.versionColumn.databaseName) + " = " + this.escape(metadata.versionColumn.databaseName) + " + 1");
            if (metadata.updateDateColumn)
                updateColumnAndValues.push(this.escape(metadata.updateDateColumn.databaseName) + " = CURRENT_TIMESTAMP"); // todo: fix issue with CURRENT_TIMESTAMP(6) being used, can "DEFAULT" be used?!
        }
        else {
            Object.keys(valuesSet).map(key => {
                let value = valuesSet[key];
                // todo: duplication zone
                if (value instanceof Function) { // support for SQL expressions in update query
                    updateColumnAndValues.push(this.escape(key) + " = " + value());
                }
                else if (this.connection.driver instanceof SapDriver_1.SapDriver && value === null) {
                    updateColumnAndValues.push(this.escape(key) + " = NULL");
                }
                else {
                    // we need to store array values in a special class to make sure parameter replacement will work correctly
                    // if (value instanceof Array)
                    //     value = new ArrayParameter(value);
                    if (this.connection.driver instanceof MysqlDriver_1.MysqlDriver ||
                        this.connection.driver instanceof AuroraDataApiDriver_1.AuroraDataApiDriver ||
                        this.connection.driver instanceof OracleDriver_1.OracleDriver ||
                        this.connection.driver instanceof AbstractSqliteDriver_1.AbstractSqliteDriver ||
                        this.connection.driver instanceof SapDriver_1.SapDriver) {
                        newParameters[key] = value;
                    }
                    else {
                        this.expressionMap.nativeParameters[key] = value;
                    }
                    updateColumnAndValues.push(this.escape(key) + " = " + this.connection.driver.createParameter(key, parametersCount));
                    parametersCount++;
                }
            });
        }
        if (updateColumnAndValues.length <= 0) {
            throw new UpdateValuesMissingError_1.UpdateValuesMissingError();
        }
        // we re-write parameters this way because we want our "UPDATE ... SET" parameters to be first in the list of "nativeParameters"
        // because some drivers like mysql depend on order of parameters
        if (this.connection.driver instanceof MysqlDriver_1.MysqlDriver ||
            this.connection.driver instanceof AuroraDataApiDriver_1.AuroraDataApiDriver ||
            this.connection.driver instanceof OracleDriver_1.OracleDriver ||
            this.connection.driver instanceof AbstractSqliteDriver_1.AbstractSqliteDriver ||
            this.connection.driver instanceof SapDriver_1.SapDriver) {
            this.expressionMap.nativeParameters = Object.assign(newParameters, this.expressionMap.nativeParameters);
        }
        // get a table name and all column database names
        const whereExpression = this.createWhereExpression();
        const returningExpression = this.createReturningExpression();
        // generate and return sql update query
        if (returningExpression && (this.connection.driver instanceof PostgresDriver_1.PostgresDriver || this.connection.driver instanceof OracleDriver_1.OracleDriver || this.connection.driver instanceof CockroachDriver_1.CockroachDriver)) {
            return `UPDATE ${this.getTableName(this.getMainTableName())} SET ${updateColumnAndValues.join(", ")}${whereExpression} RETURNING ${returningExpression}`;
        }
        else if (returningExpression && this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
            return `UPDATE ${this.getTableName(this.getMainTableName())} SET ${updateColumnAndValues.join(", ")} OUTPUT ${returningExpression}${whereExpression}`;
        }
        else {
            return `UPDATE ${this.getTableName(this.getMainTableName())} SET ${updateColumnAndValues.join(", ")}${whereExpression}`; // todo: how do we replace aliases in where to nothing?
        }
    }
    /**
     * Creates "ORDER BY" part of SQL query.
     */
    createOrderByExpression() {
        const orderBys = this.expressionMap.orderBys;
        if (Object.keys(orderBys).length > 0)
            return " ORDER BY " + Object.keys(orderBys)
                .map(columnName => {
                if (typeof orderBys[columnName] === "string") {
                    return this.replacePropertyNames(columnName) + " " + orderBys[columnName];
                }
                else {
                    return this.replacePropertyNames(columnName) + " " + orderBys[columnName].order + " " + orderBys[columnName].nulls;
                }
            })
                .join(", ");
        return "";
    }
    /**
     * Creates "LIMIT" parts of SQL query.
     */
    createLimitExpression() {
        let limit = this.expressionMap.limit;
        if (limit) {
            if (this.connection.driver instanceof MysqlDriver_1.MysqlDriver || this.connection.driver instanceof AuroraDataApiDriver_1.AuroraDataApiDriver) {
                return " LIMIT " + limit;
            }
            else {
                throw new LimitOnUpdateNotSupportedError_1.LimitOnUpdateNotSupportedError();
            }
        }
        return "";
    }
    /**
     * Gets array of values need to be inserted into the target table.
     */
    getValueSet() {
        if (this.expressionMap.valuesSet instanceof Object)
            return this.expressionMap.valuesSet;
        throw new UpdateValuesMissingError_1.UpdateValuesMissingError();
    }
}
exports.UpdateQueryBuilder = UpdateQueryBuilder;
