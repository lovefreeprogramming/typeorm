import { EntityMetadata } from "../0103-metadata/EntityMetadata";
import { FindManyOptions } from "../0302-find-options/FindManyOptions";
import { ObjectLiteral } from "../common/ObjectLiteral";
import { FindOneOptions } from "../0302-find-options/FindOneOptions";
import { DeepPartial } from "../common/DeepPartial";
import { SaveOptions } from "./SaveOptions";
import { RemoveOptions } from "./RemoveOptions";
import { EntityManager } from "../0204-entity-manager/EntityManager";
import { QueryRunner } from "../0202-query-runner/QueryRunner";
import { SelectQueryBuilder } from "../0301-query-builder/SelectQueryBuilder";
import { DeleteResult } from "../0301-query-builder/result/DeleteResult";
import { UpdateResult } from "../0301-query-builder/result/UpdateResult";
import { InsertResult } from "../0301-query-builder/result/InsertResult";
import { QueryDeepPartialEntity } from "../0301-query-builder/QueryPartialEntity";
import { ObjectID } from "../0201-driver/mongodb/typings";
import { FindConditions } from "../0302-find-options/FindConditions";
/**
 * Repository is supposed to work with your entity objects. Find entities, insert, update, delete, etc.
 */
export declare class Repository<Entity extends ObjectLiteral> {
    /**
     * Entity Manager used by this repository.
     */
    readonly manager: EntityManager;
    /**
     * Entity metadata of the entity current repository manages.
     */
    readonly metadata: EntityMetadata;
    /**
     * Query runner provider used for this repository.
     */
    readonly queryRunner?: QueryRunner;
    /**
     * Executes a raw SQL query and returns a raw database results.
     * Raw query execution is supported only by relational databases (MongoDB is not supported).
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Saves all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    save<T extends DeepPartial<Entity>>(entities: T[], options: SaveOptions & {
        reload: false;
    }): Promise<T[]>;
    /**
     * Saves all given entities in the database.
     * If entities do not exist in the database then inserts, otherwise updates.
     */
    save<T extends DeepPartial<Entity>>(entities: T[], options?: SaveOptions): Promise<(T & Entity)[]>;
    /**
     * Saves a given entity in the database.
     * If entity does not exist in the database then inserts, otherwise updates.
     */
    save<T extends DeepPartial<Entity>>(entity: T, options: SaveOptions & {
        reload: false;
    }): Promise<T>;
    /**
     * Saves a given entity in the database.
     * If entity does not exist in the database then inserts, otherwise updates.
     */
    save<T extends DeepPartial<Entity>>(entity: T, options?: SaveOptions): Promise<T & Entity>;
    /**
     * Inserts a given entity into the database.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient INSERT query.
     * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
     */
    insert(entity: QueryDeepPartialEntity<Entity> | (QueryDeepPartialEntity<Entity>[])): Promise<InsertResult>;
    /**
     * Creates a new entity from the given plan javascript object. If entity already exist in the database, then
     * it loads it (and everything related to it), replaces all values with the new ones from the given object
     * and returns this new entity. This new entity is actually a loaded from the db entity with all properties
     * replaced from the new object.
     *
     * Note that given entity-like object must have an entity id / primary key to find entity by.
     * Returns undefined if entity with given id was not found.
     */
    preload(entityLike: DeepPartial<Entity>): Promise<Entity | undefined>;
    /**
     * Deletes entities by a given criteria.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient DELETE query.
     * Does not check if entity exist in the database.
     */
    delete(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>): Promise<DeleteResult>;
    /**
     * Removes a given entities from the database.
     */
    remove(entities: Entity[], options?: RemoveOptions): Promise<Entity[]>;
    /**
     * Removes a given entity from the database.
     */
    remove(entity: Entity, options?: RemoveOptions): Promise<Entity>;
    /**
     * Clears all the data from the given table/collection (truncates/drops it).
     *
     * Note: this method uses TRUNCATE and may not work as you expect in transactions on some platforms.
     * @see https://stackoverflow.com/a/5972738/925151
     */
    clear(): Promise<void>;
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     */
    update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult>;
    /**
     * Increments some column by provided value of the entities matched given conditions.
     */
    increment(conditions: FindConditions<Entity>, propertyPath: string, value: number | string): Promise<UpdateResult>;
    /**
     * Decrements some column by provided value of the entities matched given conditions.
     */
    decrement(conditions: FindConditions<Entity>, propertyPath: string, value: number | string): Promise<UpdateResult>;
    /**
     * Finds entities that match given options.
     */
    find(options?: FindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given conditions.
     */
    find(conditions?: FindConditions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities that match given find options.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    findAndCount(options?: FindManyOptions<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities that match given conditions.
     * Also counts all entities that match given conditions,
     * but ignores pagination settings (from and take options).
     */
    findAndCount(conditions?: FindConditions<Entity>): Promise<[Entity[], number]>;
    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     */
    findByIds(ids: any[], options?: FindManyOptions<Entity>): Promise<Entity[]>;
    /**
     * Finds entities by ids.
     * Optionally conditions can be applied.
     */
    findByIds(ids: any[], conditions?: FindConditions<Entity>): Promise<Entity[]>;
    /**
     * Finds first entity that matches given options.
     */
    findOne(id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given options.
     */
    findOne(options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOne(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
    /**
     * Finds first entity that matches given options.
     */
    findOneOrFail(id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity>;
    /**
     * Finds first entity that matches given options.
     */
    findOneOrFail(options?: FindOneOptions<Entity>): Promise<Entity>;
    /**
     * Finds first entity that matches given conditions.
     */
    findOneOrFail(conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity>;
    /**
     * Counts entities that match given options.
     */
    count(options?: FindManyOptions<Entity>): Promise<number>;
    /**
     * Counts entities that match given conditions.
     */
    count(conditions?: FindConditions<Entity>): Promise<number>;
    /**
     * Creates a new entity instance.
     */
    create(): Entity;
    /**
     * Creates a new entities and copies all entity properties from given objects into their new entities.
     * Note that it copies only properties that present in entity schema.
     */
    create(entityLikeArray: DeepPartial<Entity>[]): Entity[];
    /**
     * Creates a new entity instance and copies all entity properties from this object into a new entity.
     * Note that it copies only properties that present in entity schema.
     */
    create(entityLike: DeepPartial<Entity>): Entity;
    /**
     * Merges multiple entities (or entity-like objects) into a given entity.
     */
    merge(mergeIntoEntity: Entity, ...entityLikes: DeepPartial<Entity>[]): Entity;
    /**
     * Creates a new query builder that can be used to build a sql query.
     */
    createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<Entity>;
    /**
     * Returns object that is managed by this repository.
     * If this repository manages entity from schema,
     * then it returns a name of that schema instead.
     */
    get target(): Function | string;
    /**
     * Checks if entity has an id.
     * If entity composite compose ids, it will check them all.
     */
    hasId(entity: Entity): boolean;
    /**
     * Gets entity mixed id.
     */
    getId(entity: Entity): any;
}
