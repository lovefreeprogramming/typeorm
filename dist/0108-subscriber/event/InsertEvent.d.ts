import { EntityManager } from "../../0204-entity-manager/EntityManager";
import { Connection } from "../../0203-connection/Connection";
import { QueryRunner } from "../../0202-query-runner/QueryRunner";
import { EntityMetadata } from "../../0103-metadata/EntityMetadata";
/**
 * InsertEvent is an object that broadcaster sends to the entity subscriber when entity is inserted to the database.
 */
export interface InsertEvent<Entity> {
    /**
     * Connection used in the event.
     */
    connection: Connection;
    /**
     * QueryRunner used in the event transaction.
     * All database operations in the subscribed event listener should be performed using this query runner instance.
     */
    queryRunner: QueryRunner;
    /**
     * EntityManager used in the event transaction.
     * All database operations in the subscribed event listener should be performed using this entity manager instance.
     */
    manager: EntityManager;
    /**
     * Inserting event.
     */
    entity: Entity;
    /**
     * Metadata of the entity.
     */
    metadata: EntityMetadata;
}
