import { EntityMetadata } from "../0103-metadata/EntityMetadata";
import { RelationMetadata } from "../0103-metadata/RelationMetadata";
/**
 */
export declare class UsingJoinColumnOnlyOnOneSideAllowedError extends Error {
    name: string;
    constructor(entityMetadata: EntityMetadata, relation: RelationMetadata);
}
