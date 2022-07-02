import { EntitySchema } from "./EntitySchema";
import { MetadataArgsStorage } from "../0102-metadata-args/MetadataArgsStorage";
/**
 * Transforms entity schema into metadata args storage.
 * The result will be just like entities read from decorators.
 */
export declare class EntitySchemaTransformer {
    /**
     * Transforms entity schema into new metadata args storage object.
     */
    transform(schemas: EntitySchema<any>[]): MetadataArgsStorage;
}
