import { EntityMetadata } from "../0103-metadata/EntityMetadata";
/**
 */
export declare class MissingPrimaryColumnError extends Error {
    name: string;
    constructor(entityMetadata: EntityMetadata);
}
