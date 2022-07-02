"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSqljsManager = exports.getMongoManager = exports.getMongoRepository = exports.createQueryBuilder = exports.getCustomRepository = exports.getTreeRepository = exports.getRepository = exports.getManager = exports.getConnection = exports.createConnections = exports.createConnection = exports.getConnectionManager = exports.getConnectionOptions = exports.getMetadataArgsStorage = exports.PlatformTools = exports.PromiseUtils = exports.EntitySchema = exports.BaseEntity = exports.MongoRepository = exports.TreeRepository = exports.Repository = exports.DefaultNamingStrategy = exports.MigrationExecutor = exports.Migration = exports.MongoEntityManager = exports.EntityManager = exports.DeleteResult = exports.UpdateResult = exports.InsertResult = exports.Brackets = exports.RelationQueryBuilder = exports.UpdateQueryBuilder = exports.InsertQueryBuilder = exports.DeleteQueryBuilder = exports.SelectQueryBuilder = exports.QueryBuilder = exports.ConnectionManager = exports.Connection = exports.ConnectionOptionsReader = void 0;
const tslib_1 = require("tslib");
/*!
 */
require("reflect-metadata");
const ConnectionManager_1 = require("./0203-connection/ConnectionManager");
const MetadataArgsStorage_1 = require("./0102-metadata-args/MetadataArgsStorage");
const container_1 = require("./container");
const PlatformTools_1 = require("./platform/PlatformTools");
const ConnectionOptionsReader_1 = require("./0203-connection/ConnectionOptionsReader");
const PromiseUtils_1 = require("./util/PromiseUtils");
// -------------------------------------------------------------------------
// Commonly Used exports
// -------------------------------------------------------------------------
tslib_1.__exportStar(require("./0106-metadata-builder/EntityMetadataBuilder"), exports);
tslib_1.__exportStar(require("./container"), exports);
tslib_1.__exportStar(require("./common/ObjectType"), exports);
tslib_1.__exportStar(require("./common/ObjectLiteral"), exports);
tslib_1.__exportStar(require("./common/DeepPartial"), exports);
tslib_1.__exportStar(require("./0402-error/QueryFailedError"), exports);
tslib_1.__exportStar(require("./0101-decorator/columns/Column"), exports);
tslib_1.__exportStar(require("./0101-decorator/columns/CreateDateColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/columns/PrimaryGeneratedColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/columns/PrimaryColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/columns/UpdateDateColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/columns/VersionColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/columns/ViewColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/columns/ObjectIdColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/listeners/AfterInsert"), exports);
tslib_1.__exportStar(require("./0101-decorator/listeners/AfterLoad"), exports);
tslib_1.__exportStar(require("./0101-decorator/listeners/AfterRemove"), exports);
tslib_1.__exportStar(require("./0101-decorator/listeners/AfterUpdate"), exports);
tslib_1.__exportStar(require("./0101-decorator/listeners/BeforeInsert"), exports);
tslib_1.__exportStar(require("./0101-decorator/listeners/BeforeRemove"), exports);
tslib_1.__exportStar(require("./0101-decorator/listeners/BeforeUpdate"), exports);
tslib_1.__exportStar(require("./0101-decorator/listeners/EventSubscriber"), exports);
tslib_1.__exportStar(require("./0101-decorator/options/ColumnOptions"), exports);
tslib_1.__exportStar(require("./0101-decorator/options/IndexOptions"), exports);
tslib_1.__exportStar(require("./0101-decorator/options/JoinColumnOptions"), exports);
tslib_1.__exportStar(require("./0101-decorator/options/JoinTableOptions"), exports);
tslib_1.__exportStar(require("./0101-decorator/options/RelationOptions"), exports);
tslib_1.__exportStar(require("./0101-decorator/options/EntityOptions"), exports);
tslib_1.__exportStar(require("./0101-decorator/options/ValueTransformer"), exports);
tslib_1.__exportStar(require("./0101-decorator/relations/JoinColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/relations/JoinTable"), exports);
tslib_1.__exportStar(require("./0101-decorator/relations/ManyToMany"), exports);
tslib_1.__exportStar(require("./0101-decorator/relations/ManyToOne"), exports);
tslib_1.__exportStar(require("./0101-decorator/relations/OneToMany"), exports);
tslib_1.__exportStar(require("./0101-decorator/relations/OneToOne"), exports);
tslib_1.__exportStar(require("./0101-decorator/relations/RelationCount"), exports);
tslib_1.__exportStar(require("./0101-decorator/relations/RelationId"), exports);
tslib_1.__exportStar(require("./0101-decorator/entity/Entity"), exports);
tslib_1.__exportStar(require("./0101-decorator/entity/ChildEntity"), exports);
tslib_1.__exportStar(require("./0101-decorator/entity/TableInheritance"), exports);
tslib_1.__exportStar(require("./0101-decorator/entity-view/ViewEntity"), exports);
tslib_1.__exportStar(require("./0101-decorator/transaction/Transaction"), exports);
tslib_1.__exportStar(require("./0101-decorator/transaction/TransactionManager"), exports);
tslib_1.__exportStar(require("./0101-decorator/transaction/TransactionRepository"), exports);
tslib_1.__exportStar(require("./0101-decorator/tree/TreeLevelColumn"), exports);
tslib_1.__exportStar(require("./0101-decorator/tree/TreeParent"), exports);
tslib_1.__exportStar(require("./0101-decorator/tree/TreeChildren"), exports);
tslib_1.__exportStar(require("./0101-decorator/tree/Tree"), exports);
tslib_1.__exportStar(require("./0101-decorator/Index"), exports);
tslib_1.__exportStar(require("./0101-decorator/Unique"), exports);
tslib_1.__exportStar(require("./0101-decorator/Check"), exports);
tslib_1.__exportStar(require("./0101-decorator/Exclusion"), exports);
tslib_1.__exportStar(require("./0101-decorator/Generated"), exports);
tslib_1.__exportStar(require("./0101-decorator/EntityRepository"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/Any"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/Between"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/Equal"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/In"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/IsNull"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/LessThan"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/LessThanOrEqual"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/Like"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/MoreThan"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/MoreThanOrEqual"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/Not"), exports);
tslib_1.__exportStar(require("./0302-find-options/operator/Raw"), exports);
tslib_1.__exportStar(require("./0302-find-options/FindConditions"), exports);
tslib_1.__exportStar(require("./0302-find-options/FindManyOptions"), exports);
tslib_1.__exportStar(require("./0302-find-options/FindOneOptions"), exports);
tslib_1.__exportStar(require("./0302-find-options/FindOperator"), exports);
tslib_1.__exportStar(require("./0302-find-options/FindOperatorType"), exports);
tslib_1.__exportStar(require("./0302-find-options/JoinOptions"), exports);
tslib_1.__exportStar(require("./0302-find-options/OrderByCondition"), exports);
tslib_1.__exportStar(require("./0302-find-options/FindOptionsUtils"), exports);
tslib_1.__exportStar(require("./0401-logger/Logger"), exports);
tslib_1.__exportStar(require("./0401-logger/AdvancedConsoleLogger"), exports);
tslib_1.__exportStar(require("./0401-logger/SimpleConsoleLogger"), exports);
tslib_1.__exportStar(require("./0401-logger/FileLogger"), exports);
tslib_1.__exportStar(require("./0103-metadata/EntityMetadata"), exports);
tslib_1.__exportStar(require("./0204-entity-manager/EntityManager"), exports);
tslib_1.__exportStar(require("./0205-repository/AbstractRepository"), exports);
tslib_1.__exportStar(require("./0205-repository/Repository"), exports);
tslib_1.__exportStar(require("./0205-repository/BaseEntity"), exports);
tslib_1.__exportStar(require("./0205-repository/TreeRepository"), exports);
tslib_1.__exportStar(require("./0205-repository/MongoRepository"), exports);
tslib_1.__exportStar(require("./0205-repository/RemoveOptions"), exports);
tslib_1.__exportStar(require("./0205-repository/SaveOptions"), exports);
tslib_1.__exportStar(require("./0107-schema-builder/table/TableCheck"), exports);
tslib_1.__exportStar(require("./0107-schema-builder/table/TableColumn"), exports);
tslib_1.__exportStar(require("./0107-schema-builder/table/TableExclusion"), exports);
tslib_1.__exportStar(require("./0107-schema-builder/table/TableForeignKey"), exports);
tslib_1.__exportStar(require("./0107-schema-builder/table/TableIndex"), exports);
tslib_1.__exportStar(require("./0107-schema-builder/table/TableUnique"), exports);
tslib_1.__exportStar(require("./0107-schema-builder/table/Table"), exports);
tslib_1.__exportStar(require("./0201-driver/mongodb/typings"), exports);
tslib_1.__exportStar(require("./0201-driver/types/DatabaseType"), exports);
tslib_1.__exportStar(require("./0201-driver/sqlserver/MssqlParameter"), exports);
var ConnectionOptionsReader_2 = require("./0203-connection/ConnectionOptionsReader");
Object.defineProperty(exports, "ConnectionOptionsReader", { enumerable: true, get: function () { return ConnectionOptionsReader_2.ConnectionOptionsReader; } });
var Connection_1 = require("./0203-connection/Connection");
Object.defineProperty(exports, "Connection", { enumerable: true, get: function () { return Connection_1.Connection; } });
var ConnectionManager_2 = require("./0203-connection/ConnectionManager");
Object.defineProperty(exports, "ConnectionManager", { enumerable: true, get: function () { return ConnectionManager_2.ConnectionManager; } });
var QueryBuilder_1 = require("./0301-query-builder/QueryBuilder");
Object.defineProperty(exports, "QueryBuilder", { enumerable: true, get: function () { return QueryBuilder_1.QueryBuilder; } });
var SelectQueryBuilder_1 = require("./0301-query-builder/SelectQueryBuilder");
Object.defineProperty(exports, "SelectQueryBuilder", { enumerable: true, get: function () { return SelectQueryBuilder_1.SelectQueryBuilder; } });
var DeleteQueryBuilder_1 = require("./0301-query-builder/DeleteQueryBuilder");
Object.defineProperty(exports, "DeleteQueryBuilder", { enumerable: true, get: function () { return DeleteQueryBuilder_1.DeleteQueryBuilder; } });
var InsertQueryBuilder_1 = require("./0301-query-builder/InsertQueryBuilder");
Object.defineProperty(exports, "InsertQueryBuilder", { enumerable: true, get: function () { return InsertQueryBuilder_1.InsertQueryBuilder; } });
var UpdateQueryBuilder_1 = require("./0301-query-builder/UpdateQueryBuilder");
Object.defineProperty(exports, "UpdateQueryBuilder", { enumerable: true, get: function () { return UpdateQueryBuilder_1.UpdateQueryBuilder; } });
var RelationQueryBuilder_1 = require("./0301-query-builder/RelationQueryBuilder");
Object.defineProperty(exports, "RelationQueryBuilder", { enumerable: true, get: function () { return RelationQueryBuilder_1.RelationQueryBuilder; } });
var Brackets_1 = require("./0301-query-builder/Brackets");
Object.defineProperty(exports, "Brackets", { enumerable: true, get: function () { return Brackets_1.Brackets; } });
var InsertResult_1 = require("./0301-query-builder/result/InsertResult");
Object.defineProperty(exports, "InsertResult", { enumerable: true, get: function () { return InsertResult_1.InsertResult; } });
var UpdateResult_1 = require("./0301-query-builder/result/UpdateResult");
Object.defineProperty(exports, "UpdateResult", { enumerable: true, get: function () { return UpdateResult_1.UpdateResult; } });
var DeleteResult_1 = require("./0301-query-builder/result/DeleteResult");
Object.defineProperty(exports, "DeleteResult", { enumerable: true, get: function () { return DeleteResult_1.DeleteResult; } });
var EntityManager_1 = require("./0204-entity-manager/EntityManager");
Object.defineProperty(exports, "EntityManager", { enumerable: true, get: function () { return EntityManager_1.EntityManager; } });
var MongoEntityManager_1 = require("./0204-entity-manager/MongoEntityManager");
Object.defineProperty(exports, "MongoEntityManager", { enumerable: true, get: function () { return MongoEntityManager_1.MongoEntityManager; } });
var Migration_1 = require("./0109-migration/Migration");
Object.defineProperty(exports, "Migration", { enumerable: true, get: function () { return Migration_1.Migration; } });
var MigrationExecutor_1 = require("./0109-migration/MigrationExecutor");
Object.defineProperty(exports, "MigrationExecutor", { enumerable: true, get: function () { return MigrationExecutor_1.MigrationExecutor; } });
var DefaultNamingStrategy_1 = require("./0104-naming-strategy/DefaultNamingStrategy");
Object.defineProperty(exports, "DefaultNamingStrategy", { enumerable: true, get: function () { return DefaultNamingStrategy_1.DefaultNamingStrategy; } });
var Repository_1 = require("./0205-repository/Repository");
Object.defineProperty(exports, "Repository", { enumerable: true, get: function () { return Repository_1.Repository; } });
var TreeRepository_1 = require("./0205-repository/TreeRepository");
Object.defineProperty(exports, "TreeRepository", { enumerable: true, get: function () { return TreeRepository_1.TreeRepository; } });
var MongoRepository_1 = require("./0205-repository/MongoRepository");
Object.defineProperty(exports, "MongoRepository", { enumerable: true, get: function () { return MongoRepository_1.MongoRepository; } });
var BaseEntity_1 = require("./0205-repository/BaseEntity");
Object.defineProperty(exports, "BaseEntity", { enumerable: true, get: function () { return BaseEntity_1.BaseEntity; } });
var EntitySchema_1 = require("./0105-entity-schema/EntitySchema");
Object.defineProperty(exports, "EntitySchema", { enumerable: true, get: function () { return EntitySchema_1.EntitySchema; } });
var PromiseUtils_2 = require("./util/PromiseUtils");
Object.defineProperty(exports, "PromiseUtils", { enumerable: true, get: function () { return PromiseUtils_2.PromiseUtils; } });
var PlatformTools_2 = require("./platform/PlatformTools");
Object.defineProperty(exports, "PlatformTools", { enumerable: true, get: function () { return PlatformTools_2.PlatformTools; } });
// -------------------------------------------------------------------------
// Deprecated
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
// Commonly used functionality
// -------------------------------------------------------------------------
/**
 * Gets metadata args storage.
 */
function getMetadataArgsStorage() {
    // we should store metadata storage in a global variable otherwise it brings too much problems
    // one of the problem is that if any entity (or any other) will be imported before consumer will call
    // useContainer method with his own container implementation, that entity will be registered in the
    // old old container (default one post probably) and consumer will his entity.
    // calling useContainer before he imports any entity (or any other) is not always convenient.
    // another reason is that when we run migrations typeorm is being called from a global package
    // and it may load entities which register decorators in typeorm of local package
    // this leads to impossibility of usage of entities in migrations and cli related operations
    const globalScope = PlatformTools_1.PlatformTools.getGlobalVariable();
    if (!globalScope.typeormMetadataArgsStorage)
        globalScope.typeormMetadataArgsStorage = new MetadataArgsStorage_1.MetadataArgsStorage();
    return globalScope.typeormMetadataArgsStorage;
}
exports.getMetadataArgsStorage = getMetadataArgsStorage;
/**
 * Reads connection options stored in ormconfig configuration file.
 */
async function getConnectionOptions(connectionName = "default") {
    return new ConnectionOptionsReader_1.ConnectionOptionsReader().get(connectionName);
}
exports.getConnectionOptions = getConnectionOptions;
/**
 * Gets a ConnectionManager which creates connections.
 */
function getConnectionManager() {
    return container_1.getFromContainer(ConnectionManager_1.ConnectionManager);
}
exports.getConnectionManager = getConnectionManager;
/**
 * Creates a new connection and registers it in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
async function createConnection(optionsOrName) {
    const connectionName = typeof optionsOrName === "string" ? optionsOrName : "default";
    const options = optionsOrName instanceof Object ? optionsOrName : await getConnectionOptions(connectionName);
    return getConnectionManager().create(options).connect();
}
exports.createConnection = createConnection;
/**
 * Creates new connections and registers them in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * All connections from the ormconfig will be created.
 */
async function createConnections(options) {
    if (!options)
        options = await new ConnectionOptionsReader_1.ConnectionOptionsReader().all();
    const connections = options.map(options => getConnectionManager().create(options));
    return PromiseUtils_1.PromiseUtils.runInSequence(connections, connection => connection.connect());
}
exports.createConnections = createConnections;
/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
function getConnection(connectionName = "default") {
    return getConnectionManager().get(connectionName);
}
exports.getConnection = getConnection;
/**
 * Gets entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
function getManager(connectionName = "default") {
    return getConnectionManager().get(connectionName).manager;
}
exports.getManager = getManager;
/**
 * Gets repository for the given entity class.
 */
function getRepository(entityClass, connectionName = "default") {
    return getConnectionManager().get(connectionName).getRepository(entityClass);
}
exports.getRepository = getRepository;
/**
 * Gets tree repository for the given entity class.
 */
function getTreeRepository(entityClass, connectionName = "default") {
    return getConnectionManager().get(connectionName).getTreeRepository(entityClass);
}
exports.getTreeRepository = getTreeRepository;
/**
 * Gets tree repository for the given entity class.
 */
function getCustomRepository(customRepository, connectionName = "default") {
    return getConnectionManager().get(connectionName).getCustomRepository(customRepository);
}
exports.getCustomRepository = getCustomRepository;
/**
 * Creates a new query builder.
 */
function createQueryBuilder(entityClass, alias, connectionName = "default") {
    if (entityClass) {
        return getRepository(entityClass, connectionName).createQueryBuilder(alias);
    }
    return getConnection(connectionName).createQueryBuilder();
}
exports.createQueryBuilder = createQueryBuilder;
//--------region------
/**
 * Gets mongodb repository for the given entity class or name.
 */
function getMongoRepository(entityClass, connectionName = "default") {
    return getConnectionManager().get(connectionName).getMongoRepository(entityClass);
}
exports.getMongoRepository = getMongoRepository;
/**
 * Gets MongoDB entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
function getMongoManager(connectionName = "default") {
    return getConnectionManager().get(connectionName).manager;
}
exports.getMongoManager = getMongoManager;
/**
 * Gets Sqljs entity manager from connection name.
 * "default" connection is used, when no name is specified.
 * Only works when Sqljs driver is used.
 */
function getSqljsManager(connectionName = "default") {
    return getConnectionManager().get(connectionName).manager;
}
exports.getSqljsManager = getSqljsManager;
//--------endregion------
