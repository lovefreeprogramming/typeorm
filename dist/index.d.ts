/*!
 */
import "reflect-metadata";
import { ConnectionManager } from "./0203-connection/ConnectionManager";
import { Connection } from "./0203-connection/Connection";
import { MetadataArgsStorage } from "./0102-metadata-args/MetadataArgsStorage";
import { ConnectionOptions } from "./0203-connection/ConnectionOptions";
import { ObjectType } from "./common/ObjectType";
import { Repository } from "./0205-repository/Repository";
import { EntityManager } from "./0204-entity-manager/EntityManager";
import { TreeRepository } from "./0205-repository/TreeRepository";
import { MongoRepository } from "./0205-repository/MongoRepository";
import { MongoEntityManager } from "./0204-entity-manager/MongoEntityManager";
import { SqljsEntityManager } from "./0204-entity-manager/SqljsEntityManager";
import { SelectQueryBuilder } from "./0301-query-builder/SelectQueryBuilder";
import { EntitySchema } from "./0105-entity-schema/EntitySchema";
export * from "./0106-metadata-builder/EntityMetadataBuilder";
export * from "./container";
export * from "./common/ObjectType";
export * from "./common/ObjectLiteral";
export * from "./common/DeepPartial";
export * from "./0402-error/QueryFailedError";
export * from "./0101-decorator/columns/Column";
export * from "./0101-decorator/columns/CreateDateColumn";
export * from "./0101-decorator/columns/PrimaryGeneratedColumn";
export * from "./0101-decorator/columns/PrimaryColumn";
export * from "./0101-decorator/columns/UpdateDateColumn";
export * from "./0101-decorator/columns/VersionColumn";
export * from "./0101-decorator/columns/ViewColumn";
export * from "./0101-decorator/columns/ObjectIdColumn";
export * from "./0101-decorator/listeners/AfterInsert";
export * from "./0101-decorator/listeners/AfterLoad";
export * from "./0101-decorator/listeners/AfterRemove";
export * from "./0101-decorator/listeners/AfterUpdate";
export * from "./0101-decorator/listeners/BeforeInsert";
export * from "./0101-decorator/listeners/BeforeRemove";
export * from "./0101-decorator/listeners/BeforeUpdate";
export * from "./0101-decorator/listeners/EventSubscriber";
export * from "./0101-decorator/options/ColumnOptions";
export * from "./0101-decorator/options/IndexOptions";
export * from "./0101-decorator/options/JoinColumnOptions";
export * from "./0101-decorator/options/JoinTableOptions";
export * from "./0101-decorator/options/RelationOptions";
export * from "./0101-decorator/options/EntityOptions";
export * from "./0101-decorator/options/ValueTransformer";
export * from "./0101-decorator/relations/JoinColumn";
export * from "./0101-decorator/relations/JoinTable";
export * from "./0101-decorator/relations/ManyToMany";
export * from "./0101-decorator/relations/ManyToOne";
export * from "./0101-decorator/relations/OneToMany";
export * from "./0101-decorator/relations/OneToOne";
export * from "./0101-decorator/relations/RelationCount";
export * from "./0101-decorator/relations/RelationId";
export * from "./0101-decorator/entity/Entity";
export * from "./0101-decorator/entity/ChildEntity";
export * from "./0101-decorator/entity/TableInheritance";
export * from "./0101-decorator/entity-view/ViewEntity";
export * from "./0101-decorator/transaction/Transaction";
export * from "./0101-decorator/transaction/TransactionManager";
export * from "./0101-decorator/transaction/TransactionRepository";
export * from "./0101-decorator/tree/TreeLevelColumn";
export * from "./0101-decorator/tree/TreeParent";
export * from "./0101-decorator/tree/TreeChildren";
export * from "./0101-decorator/tree/Tree";
export * from "./0101-decorator/Index";
export * from "./0101-decorator/Unique";
export * from "./0101-decorator/Check";
export * from "./0101-decorator/Exclusion";
export * from "./0101-decorator/Generated";
export * from "./0101-decorator/EntityRepository";
export * from "./0302-find-options/operator/Any";
export * from "./0302-find-options/operator/Between";
export * from "./0302-find-options/operator/Equal";
export * from "./0302-find-options/operator/In";
export * from "./0302-find-options/operator/IsNull";
export * from "./0302-find-options/operator/LessThan";
export * from "./0302-find-options/operator/LessThanOrEqual";
export * from "./0302-find-options/operator/Like";
export * from "./0302-find-options/operator/MoreThan";
export * from "./0302-find-options/operator/MoreThanOrEqual";
export * from "./0302-find-options/operator/Not";
export * from "./0302-find-options/operator/Raw";
export * from "./0302-find-options/FindConditions";
export * from "./0302-find-options/FindManyOptions";
export * from "./0302-find-options/FindOneOptions";
export * from "./0302-find-options/FindOperator";
export * from "./0302-find-options/FindOperatorType";
export * from "./0302-find-options/JoinOptions";
export * from "./0302-find-options/OrderByCondition";
export * from "./0302-find-options/FindOptionsUtils";
export * from "./0401-logger/Logger";
export * from "./0401-logger/AdvancedConsoleLogger";
export * from "./0401-logger/SimpleConsoleLogger";
export * from "./0401-logger/FileLogger";
export * from "./0103-metadata/EntityMetadata";
export * from "./0204-entity-manager/EntityManager";
export * from "./0205-repository/AbstractRepository";
export * from "./0205-repository/Repository";
export * from "./0205-repository/BaseEntity";
export * from "./0205-repository/TreeRepository";
export * from "./0205-repository/MongoRepository";
export * from "./0205-repository/RemoveOptions";
export * from "./0205-repository/SaveOptions";
export * from "./0107-schema-builder/table/TableCheck";
export * from "./0107-schema-builder/table/TableColumn";
export * from "./0107-schema-builder/table/TableExclusion";
export * from "./0107-schema-builder/table/TableForeignKey";
export * from "./0107-schema-builder/table/TableIndex";
export * from "./0107-schema-builder/table/TableUnique";
export * from "./0107-schema-builder/table/Table";
export * from "./0201-driver/mongodb/typings";
export * from "./0201-driver/types/DatabaseType";
export * from "./0201-driver/sqlserver/MssqlParameter";
export { ConnectionOptionsReader } from "./0203-connection/ConnectionOptionsReader";
export { Connection } from "./0203-connection/Connection";
export { ConnectionManager } from "./0203-connection/ConnectionManager";
export { ConnectionOptions } from "./0203-connection/ConnectionOptions";
export { Driver } from "./0201-driver/Driver";
export { QueryBuilder } from "./0301-query-builder/QueryBuilder";
export { SelectQueryBuilder } from "./0301-query-builder/SelectQueryBuilder";
export { DeleteQueryBuilder } from "./0301-query-builder/DeleteQueryBuilder";
export { InsertQueryBuilder } from "./0301-query-builder/InsertQueryBuilder";
export { UpdateQueryBuilder } from "./0301-query-builder/UpdateQueryBuilder";
export { RelationQueryBuilder } from "./0301-query-builder/RelationQueryBuilder";
export { Brackets } from "./0301-query-builder/Brackets";
export { WhereExpression } from "./0301-query-builder/WhereExpression";
export { InsertResult } from "./0301-query-builder/result/InsertResult";
export { UpdateResult } from "./0301-query-builder/result/UpdateResult";
export { DeleteResult } from "./0301-query-builder/result/DeleteResult";
export { QueryRunner } from "./0202-query-runner/QueryRunner";
export { EntityManager } from "./0204-entity-manager/EntityManager";
export { MongoEntityManager } from "./0204-entity-manager/MongoEntityManager";
export { Migration } from "./0109-migration/Migration";
export { MigrationExecutor } from "./0109-migration/MigrationExecutor";
export { MigrationInterface } from "./0109-migration/MigrationInterface";
export { DefaultNamingStrategy } from "./0104-naming-strategy/DefaultNamingStrategy";
export { NamingStrategyInterface } from "./0104-naming-strategy/NamingStrategyInterface";
export { Repository } from "./0205-repository/Repository";
export { TreeRepository } from "./0205-repository/TreeRepository";
export { MongoRepository } from "./0205-repository/MongoRepository";
export { FindOneOptions } from "./0302-find-options/FindOneOptions";
export { FindManyOptions } from "./0302-find-options/FindManyOptions";
export { InsertEvent } from "./0108-subscriber/event/InsertEvent";
export { UpdateEvent } from "./0108-subscriber/event/UpdateEvent";
export { RemoveEvent } from "./0108-subscriber/event/RemoveEvent";
export { EntitySubscriberInterface } from "./0108-subscriber/EntitySubscriberInterface";
export { BaseEntity } from "./0205-repository/BaseEntity";
export { EntitySchema } from "./0105-entity-schema/EntitySchema";
export { EntitySchemaColumnOptions } from "./0105-entity-schema/EntitySchemaColumnOptions";
export { EntitySchemaIndexOptions } from "./0105-entity-schema/EntitySchemaIndexOptions";
export { EntitySchemaRelationOptions } from "./0105-entity-schema/EntitySchemaRelationOptions";
export { ColumnType } from "./0201-driver/types/ColumnTypes";
export { PlatformTools } from "./platform/PlatformTools";
/**
 * Gets metadata args storage.
 */
export declare function getMetadataArgsStorage(): MetadataArgsStorage;
/**
 * Reads connection options stored in ormconfig configuration file.
 */
export declare function getConnectionOptions(connectionName?: string): Promise<ConnectionOptions>;
/**
 * Gets a ConnectionManager which creates connections.
 */
export declare function getConnectionManager(): ConnectionManager;
/**
 * Creates a new connection and registers it in the manager.
 * Only one connection from ormconfig will be created (name "default" or connection without name).
 */
export declare function createConnection(): Promise<Connection>;
/**
 * Creates a new connection from the ormconfig file with a given name.
 */
export declare function createConnection(name: string): Promise<Connection>;
/**
 * Creates a new connection and registers it in the manager.
 */
export declare function createConnection(options: ConnectionOptions): Promise<Connection>;
/**
 * Creates new connections and registers them in the manager.
 *
 * If connection options were not specified, then it will try to create connection automatically,
 * based on content of ormconfig (json/js/yml/xml/env) file or environment variables.
 * All connections from the ormconfig will be created.
 */
export declare function createConnections(options?: ConnectionOptions[]): Promise<Connection[]>;
/**
 * Gets connection from the connection manager.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export declare function getConnection(connectionName?: string): Connection;
/**
 * Gets entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export declare function getManager(connectionName?: string): EntityManager;
/**
 * Gets repository for the given entity class.
 */
export declare function getRepository<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | string, connectionName?: string): Repository<Entity>;
/**
 * Gets tree repository for the given entity class.
 */
export declare function getTreeRepository<Entity>(entityClass: ObjectType<Entity> | string, connectionName?: string): TreeRepository<Entity>;
/**
 * Gets tree repository for the given entity class.
 */
export declare function getCustomRepository<T>(customRepository: ObjectType<T>, connectionName?: string): T;
/**
 * Creates a new query builder.
 */
export declare function createQueryBuilder<Entity>(entityClass?: ObjectType<Entity> | string, alias?: string, connectionName?: string): SelectQueryBuilder<Entity>;
/**
 * Gets mongodb repository for the given entity class or name.
 */
export declare function getMongoRepository<Entity>(entityClass: ObjectType<Entity> | string, connectionName?: string): MongoRepository<Entity>;
/**
 * Gets MongoDB entity manager from the connection.
 * If connection name wasn't specified, then "default" connection will be retrieved.
 */
export declare function getMongoManager(connectionName?: string): MongoEntityManager;
/**
 * Gets Sqljs entity manager from connection name.
 * "default" connection is used, when no name is specified.
 * Only works when Sqljs driver is used.
 */
export declare function getSqljsManager(connectionName?: string): SqljsEntityManager;
