import { EntityMetadata } from "../0103-metadata/EntityMetadata";
import { Connection } from "../0203-connection/Connection";
/**
 * Creates EntityMetadata for junction tables of the closure entities.
 * Closure junction tables are tables generated by closure entities.
 */
export declare class ClosureJunctionEntityMetadataBuilder {
    private connection;
    constructor(connection: Connection);
    /**
     * Builds EntityMetadata for the closure junction of the given closure entity.
     */
    build(parentClosureEntityMetadata: EntityMetadata): EntityMetadata;
}
