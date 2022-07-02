import { MigrationInterface } from "../0109-migration/MigrationInterface";
import { Connection } from "./Connection";
import { EntitySchema } from "../0105-entity-schema/EntitySchema";
import { EntityMetadata } from "../0103-metadata/EntityMetadata";
import { EntitySubscriberInterface } from "../0108-subscriber/EntitySubscriberInterface";
/**
 * Builds migration instances, subscriber instances and entity metadatas for the given classes.
 */
export declare class ConnectionMetadataBuilder {
    protected connection: Connection;
    constructor(connection: Connection);
    /**
     * Builds entity metadatas for the given classes or directories.
     */
    buildEntityMetadatas(entities: (Function | EntitySchema<any> | string)[]): EntityMetadata[];
    /**
     * Builds subscriber instances for the given classes or directories.
     */
    buildSubscribers(subscribers: (Function | string)[]): EntitySubscriberInterface<any>[];
    /**
     * Builds migration instances for the given classes or directories.
     */
    buildMigrations(migrations: (Function | string)[]): MigrationInterface[];
}
