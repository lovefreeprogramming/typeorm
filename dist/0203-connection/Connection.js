"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const DefaultNamingStrategy_1 = require("../0104-naming-strategy/DefaultNamingStrategy");
const CannotExecuteNotConnectedError_1 = require("../0402-error/CannotExecuteNotConnectedError");
const CannotConnectAlreadyConnectedError_1 = require("../0402-error/CannotConnectAlreadyConnectedError");
const EntityMetadataNotFoundError_1 = require("../0402-error/EntityMetadataNotFoundError");
const MigrationExecutor_1 = require("../0109-migration/MigrationExecutor");
const MongoDriver_1 = require("../0201-driver/mongodb/MongoDriver");
const MongoEntityManager_1 = require("../0204-entity-manager/MongoEntityManager");
const EntityMetadataValidator_1 = require("../0106-metadata-builder/EntityMetadataValidator");
const QueryRunnerProviderAlreadyReleasedError_1 = require("../0402-error/QueryRunnerProviderAlreadyReleasedError");
const EntityManagerFactory_1 = require("../0204-entity-manager/EntityManagerFactory");
const DriverFactory_1 = require("../0201-driver/DriverFactory");
const ConnectionMetadataBuilder_1 = require("./ConnectionMetadataBuilder");
const SelectQueryBuilder_1 = require("../0301-query-builder/SelectQueryBuilder");
const LoggerFactory_1 = require("../0401-logger/LoggerFactory");
const QueryResultCacheFactory_1 = require("../0403-cache/QueryResultCacheFactory");
const SqljsEntityManager_1 = require("../0204-entity-manager/SqljsEntityManager");
const RelationLoader_1 = require("../0301-query-builder/RelationLoader");
const RelationIdLoader_1 = require("../0301-query-builder/RelationIdLoader");
const index_1 = require("../index");
const SqlServerDriver_1 = require("../0201-driver/sqlserver/SqlServerDriver");
const MysqlDriver_1 = require("../0201-driver/mysql/MysqlDriver");
const ObjectUtils_1 = require("../util/ObjectUtils");
const index_2 = require("../index");
const AuroraDataApiDriver_1 = require("../0201-driver/aurora-data-api/AuroraDataApiDriver");
/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 */
class Connection {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(options) {
        /**
         * All entity metadatas that are registered for this connection.
         */
        this.entityMetadatas = [];
        /**
         * Entity subscriber instances that are registered for this connection.
         */
        this.subscribers = [];
        /**
         * Migration instances that are registered for this connection.
         */
        this.migrations = [];
        ////基础配置
        this.name = options.name || "default";
        this.options = options;
        this.isConnected = false;
        ////常用工具
        this.logger = new LoggerFactory_1.LoggerFactory().create(this.options.logger, this.options.logging);
        this.driver = new DriverFactory_1.DriverFactory().create(this);
        this.manager = this.createEntityManager();
        this.namingStrategy = options.namingStrategy || new DefaultNamingStrategy_1.DefaultNamingStrategy();
        ////高级工具
        this.queryResultCache = options.cache ? new QueryResultCacheFactory_1.QueryResultCacheFactory(this).create() : undefined;
        this.relationLoader = new RelationLoader_1.RelationLoader(this);
        this.relationIdLoader = new RelationIdLoader_1.RelationIdLoader(this);
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Creates an Entity Manager for the current connection with the help of the EntityManagerFactory.
     */
    createEntityManager(queryRunner) {
        return new EntityManagerFactory_1.EntityManagerFactory().create(this, queryRunner);
    }
    /**
     * Creates a query runner used for perform queries on a single database connection.
     * Using query runners you can control your queries to execute using single database connection and
     * manually control your database transaction.
     *
     * Mode is used in replication mode and indicates whatever you want to connect
     * to master database or any of slave databases.
     * If you perform writes you must use master database,
     * if you perform reads you can use slave databases.
     */
    createQueryRunner(mode = "master") {
        const queryRunner = this.driver.createQueryRunner(mode);
        const manager = this.createEntityManager(queryRunner);
        Object.assign(queryRunner, { manager: manager });
        return queryRunner;
    }
    /**
     * Performs connection to the database.
     * This method should be called once on application bootstrap.
     * This method not necessarily creates database connection (depend on database type),
     * but it also can setup a connection pool with database to use.
     */
    async connect() {
        if (this.isConnected)
            throw new CannotConnectAlreadyConnectedError_1.CannotConnectAlreadyConnectedError(this.name);
        // 创建连接池,测试验证信息
        await this.driver.connect();
        // 连接缓存数据库
        if (this.queryResultCache)
            await this.queryResultCache.connect();
        // set connected status for the current connection
        ObjectUtils_1.ObjectUtils.assign(this, { isConnected: true });
        try {
            // build all metadatas registered in the current connection
            this.buildMetadatas();
            await this.driver.afterConnect();
            // if option is set - drop schema once connection is done
            if (this.options.dropSchema)
                await this.dropDatabase();
            // if option is set - automatically synchronize a schema
            if (this.options.synchronize)
                await this.synchronize();
            // if option is set - automatically synchronize a schema
            if (this.options.migrationsRun)
                await this.runMigrations({ transaction: this.options.migrationsTransactionMode });
        }
        catch (error) {
            // if for some reason build metadata fail (for example validation error during entity metadata check)
            // connection needs to be closed
            await this.close();
            throw error;
        }
        return this;
    }
    /**
     * Closes connection with the database.
     * Once connection is closed, you cannot use repositories or perform any operations except opening connection again.
     */
    async close() {
        if (!this.isConnected)
            throw new CannotExecuteNotConnectedError_1.CannotExecuteNotConnectedError(this.name);
        await this.driver.disconnect();
        // disconnect from the cache-specific database if cache was enabled
        if (this.queryResultCache)
            await this.queryResultCache.disconnect();
        ObjectUtils_1.ObjectUtils.assign(this, { isConnected: false });
    }
    /**
     * Drops the database and all its data.
     * Be careful with this method on production since this method will erase all your database tables and their data.
     * Can be used only after connection to the database is established.
     */
    // TODO rename
    async dropDatabase() {
        //获取连接
        const queryRunner = this.createQueryRunner("master");
        try {
            if (this.driver instanceof SqlServerDriver_1.SqlServerDriver || this.driver instanceof MysqlDriver_1.MysqlDriver || this.driver instanceof AuroraDataApiDriver_1.AuroraDataApiDriver) {
                const databases = this.driver.database ? [this.driver.database] : [];
                this.entityMetadatas.forEach(metadata => {
                    if (metadata.database && databases.indexOf(metadata.database) === -1) {
                        databases.push(metadata.database);
                    }
                });
                await index_2.PromiseUtils.runInSequence(databases, database => queryRunner.clearDatabase(database));
            }
            else {
                await queryRunner.clearDatabase();
            }
        }
        finally {
            //释放连接
            await queryRunner.release();
        }
    }
    /**
     * Creates database schema for all entities registered in this connection.
     * Can be used only after connection to the database is established.
     *
     * @param dropBeforeSync If set to true then it drops the database with all its tables and data
     */
    async synchronize(dropBeforeSync = false) {
        if (!this.isConnected)
            throw new CannotExecuteNotConnectedError_1.CannotExecuteNotConnectedError(this.name);
        if (dropBeforeSync)
            await this.dropDatabase();
        const schemaBuilder = this.driver.createSchemaBuilder();
        await schemaBuilder.build();
    }
    /**
     * Runs all pending migrations.
     * Can be used only after connection to the database is established.
     */
    async runMigrations(options) {
        if (!this.isConnected)
            throw new CannotExecuteNotConnectedError_1.CannotExecuteNotConnectedError(this.name);
        const migrationExecutor = new MigrationExecutor_1.MigrationExecutor(this);
        migrationExecutor.transaction = (options && options.transaction) || "all";
        const successMigrations = await migrationExecutor.executePendingMigrations();
        return successMigrations;
    }
    /**
     * Builds metadatas for all registered classes inside this connection.
     */
    buildMetadatas() {
        const connectionMetadataBuilder = new ConnectionMetadataBuilder_1.ConnectionMetadataBuilder(this);
        const entityMetadataValidator = new EntityMetadataValidator_1.EntityMetadataValidator();
        // build entity metadatas
        // const entityMetadatas = connectionMetadataBuilder.buildEntityMetadatas(this.options.entities || []);
        // ObjectUtils.assign(this, { entityMetadatas: entityMetadatas });
        this.entityMetadatas = connectionMetadataBuilder.buildEntityMetadatas(this.options.entities || []);
        // create subscribers instances if they are not disallowed from high-level (for example they can disallowed from migrations run process)
        // const subscribers = connectionMetadataBuilder.buildSubscribers(this.options.subscribers || []);
        // ObjectUtils.assign(this, { subscribers: subscribers });
        this.subscribers = connectionMetadataBuilder.buildSubscribers(this.options.subscribers || []);
        // create migration instances
        // const migrations = connectionMetadataBuilder.buildMigrations(this.options.migrations || []);
        // ObjectUtils.assign(this, { migrations: migrations });
        this.migrations = connectionMetadataBuilder.buildMigrations(this.options.migrations || []);
        this.driver.database = this.getDatabaseName();
        // validate all created entity metadatas to make sure user created entities are valid and correct
        entityMetadataValidator.validateMany(this.entityMetadatas.filter(metadata => metadata.tableType !== "view"), this.driver);
    }
    /**
     * Checks if entity metadata exist for the given entity class, target name or table name.
     */
    hasMetadata(target) {
        return !!this.findMetadata(target);
    }
    /**
     * Gets entity metadata for the given entity class or schema name.
     */
    getMetadata(target) {
        const metadata = this.findMetadata(target);
        if (!metadata)
            throw new EntityMetadataNotFoundError_1.EntityMetadataNotFoundError(target);
        return metadata;
    }
    /**
     * Gets entity metadata of the junction table (many-to-many table).
     */
    getManyToManyMetadata(entityTarget, relationPropertyPath) {
        const relationMetadata = this.getMetadata(entityTarget).findRelationWithPropertyPath(relationPropertyPath);
        if (!relationMetadata)
            throw new Error(`Relation "${relationPropertyPath}" was not found in ${entityTarget} entity.`);
        if (!relationMetadata.isManyToMany)
            throw new Error(`Relation "${entityTarget}#${relationPropertyPath}" does not have a many-to-many relationship.` +
                `You can use this method only on many-to-many relations.`);
        return relationMetadata.junctionEntityMetadata;
    }
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder(entityOrRunner, alias, queryRunner) {
        if (this instanceof MongoEntityManager_1.MongoEntityManager)
            throw new Error(`Query Builder is not supported by MongoDB.`);
        if (alias) {
            const metadata = this.getMetadata(entityOrRunner);
            return new SelectQueryBuilder_1.SelectQueryBuilder(this, queryRunner).select(alias).from(metadata.target, alias);
        }
        else {
            return new SelectQueryBuilder_1.SelectQueryBuilder(this, entityOrRunner);
        }
    }
    /**
     * Executes raw SQL query and returns raw database results.
     */
    async query(query, parameters, queryRunner) {
        if (this instanceof MongoEntityManager_1.MongoEntityManager)
            throw new Error(`Queries aren't supported by MongoDB.`);
        if (queryRunner && queryRunner.isReleased)
            throw new QueryRunnerProviderAlreadyReleasedError_1.QueryRunnerProviderAlreadyReleasedError();
        const usedQueryRunner = queryRunner || this.createQueryRunner("master");
        try {
            return await usedQueryRunner.query(query, parameters); // await is needed here because we are using finally
        }
        finally {
            if (!queryRunner)
                await usedQueryRunner.release();
        }
    }
    /**
     * Finds exist entity metadata by the given entity class, target name or table name.
     */
    findMetadata(target) {
        return this.entityMetadatas.find(metadata => {
            if (typeof metadata.target === "function" && typeof target === "function" && metadata.target.name === target.name) {
                return true;
            }
            if (metadata.target === target) {
                return true;
            }
            if (target instanceof index_1.EntitySchema) {
                return metadata.name === target.options.name;
            }
            if (typeof target === "string") {
                if (target.indexOf(".") !== -1) {
                    return metadata.tablePath === target;
                }
                else {
                    return metadata.name === target || metadata.tableName === target;
                }
            }
            return false;
        });
    }
    // This database name property is nested for replication configs.
    getDatabaseName() {
        const options = this.options;
        switch (options.type) {
            case "mysql":
            case "mariadb":
            case "postgres":
            case "cockroachdb":
            case "mssql":
            case "oracle":
                return (options.replication ? options.replication.master.database : options.database);
            default:
                return options.database;
        }
    }
    async transaction(isolationOrRunInTransaction, runInTransactionParam) {
        return this.manager.transaction(isolationOrRunInTransaction, runInTransactionParam);
    }
    /**
     * Gets repository for the given entity.
     */
    getRepository(target) {
        return this.manager.getRepository(target);
    }
    /**
     * Gets tree repository for the given entity class or name.
     * Only tree-type entities can have a TreeRepository, like ones decorated with @Tree decorator.
     */
    getTreeRepository(target) {
        return this.manager.getTreeRepository(target);
    }
    /**
     * Gets mongodb-specific repository for the given entity class or name.
     * Works only if connection is mongodb-specific.
     */
    getMongoRepository(target) {
        if (!(this.driver instanceof MongoDriver_1.MongoDriver))
            throw new Error(`You can use getMongoRepository only for MongoDB connections.`);
        return this.manager.getRepository(target);
    }
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    getCustomRepository(customRepository) {
        return this.manager.getCustomRepository(customRepository);
    }
    // -------------------------------------------------------------------------
    // Public Accessors
    // -------------------------------------------------------------------------
    /**
     * Gets the mongodb entity manager that allows to perform mongodb-specific repository operations
     * with any entity in this connection.
     *
     * Available only in mongodb connections.
     */
    get mongoManager() {
        if (!(this.manager instanceof MongoEntityManager_1.MongoEntityManager))
            throw new Error(`MongoEntityManager is only available for MongoDB databases.`);
        return this.manager;
    }
    /**
     * Gets a sql.js specific Entity Manager that allows to perform special load and save operations
     *
     * Available only in connection with the sqljs driver.
     */
    get sqljsManager() {
        if (!(this.manager instanceof SqljsEntityManager_1.SqljsEntityManager))
            throw new Error(`SqljsEntityManager is only available for Sqljs databases.`);
        return this.manager;
    }
    // -------------------------------------------------------------------------
    // command 命令实现相关函数
    // -------------------------------------------------------------------------
    /**
     * Reverts last executed migration.
     * Can be used only after connection to the database is established.
     */
    async undoLastMigration(options) {
        if (!this.isConnected)
            throw new CannotExecuteNotConnectedError_1.CannotExecuteNotConnectedError(this.name);
        const migrationExecutor = new MigrationExecutor_1.MigrationExecutor(this);
        migrationExecutor.transaction = (options && options.transaction) || "all";
        await migrationExecutor.undoLastMigration();
    }
    /**
     * Lists all migrations and whether they have been run.
     * Returns true if there are pending migrations
     */
    async showMigrations() {
        if (!this.isConnected) {
            throw new CannotExecuteNotConnectedError_1.CannotExecuteNotConnectedError(this.name);
        }
        const migrationExecutor = new MigrationExecutor_1.MigrationExecutor(this);
        return await migrationExecutor.showMigrations();
    }
}
exports.Connection = Connection;
