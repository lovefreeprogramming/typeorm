import { EntityMetadata } from "../0103-metadata/EntityMetadata";
import { RelationMetadata } from "../0103-metadata/RelationMetadata";
/**
 */
export declare class UsingJoinTableOnlyOnOneSideAllowedError extends Error {
    name: string;
    constructor(entityMetadata: EntityMetadata, relation: RelationMetadata);
}
