"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteQueryBuilder = void 0;
const CockroachDriver_1 = require("../0201-driver/cockroachdb/CockroachDriver");
const OracleDriver_1 = require("../0201-driver/oracle/OracleDriver");
const QueryBuilder_1 = require("./QueryBuilder");
const SqlServerDriver_1 = require("../0201-driver/sqlserver/SqlServerDriver");
const PostgresDriver_1 = require("../0201-driver/postgres/PostgresDriver");
const DeleteResult_1 = require("./result/DeleteResult");
const ReturningStatementNotSupportedError_1 = require("../0402-error/ReturningStatementNotSupportedError");
const SqljsDriver_1 = require("../0201-driver/sqljs/SqljsDriver");
const MysqlDriver_1 = require("../0201-driver/mysql/MysqlDriver");
const BroadcasterResult_1 = require("../0108-subscriber/BroadcasterResult");
const index_1 = require("../index");
const AuroraDataApiDriver_1 = require("../0201-driver/aurora-data-api/AuroraDataApiDriver");
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
class DeleteQueryBuilder extends QueryBuilder_1.QueryBuilder {
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
        let sql = this.createDeleteExpression();
        return sql.trim();
    }
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    async execute() {
        const [sql, parameters] = this.getQueryAndParameters();
        const queryRunner = this.obtainQueryRunner();
        let transactionStartedByUs = false;
        try {
            // start transaction if it was enabled
            if (this.expressionMap.useTransaction === true && queryRunner.isTransactionActive === false) {
                await queryRunner.startTransaction();
                transactionStartedByUs = true;
            }
            // call before deletion methods in listeners and subscribers
            if (this.expressionMap.callListeners === true && this.expressionMap.mainAlias.hasMetadata) {
                const broadcastResult = new BroadcasterResult_1.BroadcasterResult();
                queryRunner.broadcaster.broadcastBeforeRemoveEvent(broadcastResult, this.expressionMap.mainAlias.metadata);
                if (broadcastResult.promises.length > 0)
                    await Promise.all(broadcastResult.promises);
            }
            // execute query
            const deleteResult = new DeleteResult_1.DeleteResult();
            const result = await queryRunner.query(sql, parameters);
            const driver = queryRunner.connection.driver;
            if (driver instanceof MysqlDriver_1.MysqlDriver || driver instanceof AuroraDataApiDriver_1.AuroraDataApiDriver) {
                deleteResult.raw = result;
                deleteResult.affected = result.affectedRows;
            }
            else if (driver instanceof SqlServerDriver_1.SqlServerDriver || driver instanceof PostgresDriver_1.PostgresDriver || driver instanceof CockroachDriver_1.CockroachDriver) {
                deleteResult.raw = result[0] ? result[0] : null;
                // don't return 0 because it could confuse. null means that we did not receive this value
                deleteResult.affected = typeof result[1] === "number" ? result[1] : null;
            }
            else if (driver instanceof OracleDriver_1.OracleDriver) {
                deleteResult.affected = result;
            }
            else {
                deleteResult.raw = result;
            }
            // call after deletion methods in listeners and subscribers
            if (this.expressionMap.callListeners === true && this.expressionMap.mainAlias.hasMetadata) {
                const broadcastResult = new BroadcasterResult_1.BroadcasterResult();
                queryRunner.broadcaster.broadcastAfterRemoveEvent(broadcastResult, this.expressionMap.mainAlias.metadata);
                if (broadcastResult.promises.length > 0)
                    await Promise.all(broadcastResult.promises);
            }
            // close transaction if we started it
            if (transactionStartedByUs)
                await queryRunner.commitTransaction();
            return deleteResult;
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
     * Specifies FROM which entity's table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    from(entityTarget, aliasName) {
        entityTarget = entityTarget instanceof index_1.EntitySchema ? entityTarget.options.name : entityTarget;
        const mainAlias = this.createFromAlias(entityTarget, aliasName);
        this.expressionMap.setMainAlias(mainAlias);
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
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates DELETE express used to perform query.
     */
    createDeleteExpression() {
        const tableName = this.getTableName(this.getMainTableName());
        const whereExpression = this.createWhereExpression();
        const returningExpression = this.createReturningExpression();
        if (returningExpression && (this.connection.driver instanceof PostgresDriver_1.PostgresDriver || this.connection.driver instanceof CockroachDriver_1.CockroachDriver)) {
            return `DELETE FROM ${tableName}${whereExpression} RETURNING ${returningExpression}`;
        }
        else if (returningExpression !== "" && this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
            return `DELETE FROM ${tableName} OUTPUT ${returningExpression}${whereExpression}`;
        }
        else {
            return `DELETE FROM ${tableName}${whereExpression}`;
        }
    }
}
exports.DeleteQueryBuilder = DeleteQueryBuilder;