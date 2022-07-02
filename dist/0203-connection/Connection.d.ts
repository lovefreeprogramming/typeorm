import { Driver } from "../0201-driver/Driver";
import { Repository } from "../0205-repository/Repository";
import { EntitySubscriberInterface } from "../0108-subscriber/EntitySubscriberInterface";
import { ObjectType } from "../common/ObjectType";
import { EntityManager } from "../0204-entity-manager/EntityManager";
import { TreeRepository } from "../0205-repository/TreeRepository";
import { NamingStrategyInterface } from "../0104-naming-strategy/NamingStrategyInterface";
import { EntityMetadata } from "../0103-metadata/EntityMetadata";
import { Logger } from "../0401-logger/Logger";
import { MigrationInterface } from "../0109-migration/MigrationInterface";
import { Migration } from "../0109-migration/Migration";
import { MongoRepository } from "../0205-repository/MongoRepository";
import { MongoEntityManager } from "../0204-entity-manager/MongoEntityManager";
import { ConnectionOptions } from "./ConnectionOptions";
import { QueryRunner } from "../0202-query-runner/QueryRunner";
import { SelectQueryBuilder } from "../0301-query-builder/SelectQueryBuilder";
import { QueryResultCache } from "../0403-cache/QueryResultCache";
import { SqljsEntityManager } from "../0204-entity-manager/SqljsEntityManager";
import { RelationLoader } from "../0301-query-builder/RelationLoader";
import { RelationIdLoader } from "../0301-query-builder/RelationIdLoader";
import { EntitySchema } from "../index";
import { IsolationLevel } from "../0201-driver/types/IsolationLevel";
/**
 * Connection is a single database ORM connection to a specific database.
 * Its not required to be a database connection, depend on database type it can create connection pool.
 * You can have multiple connections to multiple databases in your application.
 */
export declare class Connection {
    /**
     * 连接名称.
     */
    readonly name: string;
    /**
     * 连接选项.
     */
    readonly options: ConnectionOptions;
    /**
     * 指示是否初始化连接.
     */
    readonly isConnected: boolean;
    /**
     * Database driver used by this connection.
     */
    readonly driver: Driver;
    /**
     * Logger used to log orm events.
     */
    readonly logger: Logger;
    /**
     * EntityManager of this connection.
     */
    readonly manager: EntityManager;
    /**
     * Naming strategy used in the connection.
     */
    readonly namingStrategy: NamingStrategyInterface;
    /**
     * Used to work with query result cache.
     * 在数据库 表query-result-cache或者redis中缓存数据
     */
    readonly queryResultCache?: QueryResultCache;
    /**
     * Used to load relations and work with lazy relations.
     */
    readonly relationLoader: RelationLoader;
    /**
     * Used to load relation ids of specific entity relations.
     */
    readonly relationIdLoader: RelationIdLoader;
    /**
     * All entity metadatas that are registered for this connection.
     */
    entityMetadatas: EntityMetadata[];
    /**
     * Entity subscriber instances that are registered for this connection.
     */
    subscribers: EntitySubscriberInterface<any>[];
    /**
     * Migration instances that are registered for this connection.
     */
    migrations: MigrationInterface[];
    constructor(options: ConnectionOptions);
    /**
     * Creates an Entity Manager for the current connection with the help of the EntityManagerFactory.
     */
    createEntityManager(queryRunner?: QueryRunner): EntityManager;
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
    createQueryRunner(mode?: "master" | "slave"): QueryRunner;
    /**
     * Performs connection to the database.
     * This method should be called once on application bootstrap.
     * This method not necessarily creates database connection (depend on database type),
     * but it also can setup a connection pool with database to use.
     */
    connect(): Promise<this>;
    /**
     * Closes connection with the database.
     * Once connection is closed, you cannot use repositories or perform any operations except opening connection again.
     */
    close(): Promise<void>;
    /**
     * Drops the database and all its data.
     * Be careful with this method on production since this method will erase all your database tables and their data.
     * Can be used only after connection to the database is established.
     */
    dropDatabase(): Promise<void>;
    /**
     * Creates database schema for all entities registered in this connection.
     * Can be used only after connection to the database is established.
     *
     * @param dropBeforeSync If set to true then it drops the database with all its tables and data
     */
    synchronize(dropBeforeSync?: boolean): Promise<void>;
    /**
     * Runs all pending migrations.
     * Can be used only after connection to the database is established.
     */
    runMigrations(options?: {
        transaction?: "all" | "none" | "each";
    }): Promise<Migration[]>;
    /**
     * Builds metadatas for all registered classes inside this connection.
     */
    protected buildMetadatas(): void;
    /**
     * Checks if entity metadata exist for the given entity class, target name or table name.
     */
    hasMetadata(target: Function | EntitySchema<any> | string): boolean;
    /**
     * Gets entity metadata for the given entity class or schema name.
     */
    getMetadata(target: Function | EntitySchema<any> | string): EntityMetadata;
    /**
     * Gets entity metadata of the junction table (many-to-many table).
     */
    getManyToManyMetadata(entityTarget: Function | string, relationPropertyPath: string): EntityMetadata;
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder<Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | Function | string, alias: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity>;
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder(queryRunner?: QueryRunner): SelectQueryBuilder<any>;
    /**
     * Executes raw SQL query and returns raw database results.
     */
    query(query: string, parameters?: any[], queryRunner?: QueryRunner): Promise<any>;
    /**
     * Finds exist entity metadata by the given entity class, target name or table name.
     */
    protected findMetadata(target: Function | EntitySchema<any> | string): EntityMetadata | undefined;
    protected getDatabaseName(): string;
    /**
     * Wraps given function execution (and all operations made there) into a transaction.
     * All database operations must be executed using provided entity manager.
     */
    transaction<T>(runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
    transaction<T>(isolationLevel: IsolationLevel, runInTransaction: (entityManager: EntityManager) => Promise<T>): Promise<T>;
    /**
     * Gets repository for the given entity.
     */
    getRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): Repository<Entity>;
    /**
     * Gets tree repository for the given entity class or name.
     * Only tree-type entities can have a TreeRepository, like ones decorated with @Tree decorator.
     */
    getTreeRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): TreeRepository<Entity>;
    /**
     * Gets mongodb-specific repository for the given entity class or name.
     * Works only if connection is mongodb-specific.
     */
    getMongoRepository<Entity>(target: ObjectType<Entity> | EntitySchema<Entity> | string): MongoRepository<Entity>;
    /**
     * Gets custom entity repository marked with @EntityRepository decorator.
     */
    getCustomRepository<T>(customRepository: ObjectType<T>): T;
    /**
     * Gets the mongodb entity manager that allows to perform mongodb-specific repository operations
     * with any entity in this connection.
     *
     * Available only in mongodb connections.
     */
    get mongoManager(): MongoEntityManager;
    /**
     * Gets a sql.js specific Entity Manager that allows to perform special load and save operations
     *
     * Available only in connection with the sqljs driver.
     */
    get sqljsManager(): SqljsEntityManager;
    /**
     * Reverts last executed migration.
     * Can be used only after connection to the database is established.
     */
    undoLastMigration(options?: {
        transaction?: "all" | "none" | "each";
    }): Promise<void>;
    /**
     * Lists all migrations and whether they have been run.
     * Returns true if there are pending migrations
     */
    showMigrations(): Promise<boolean>;
}
