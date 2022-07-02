import { EntityMetadata } from "../0103-metadata/EntityMetadata";
import { Repository } from "./Repository";
import { QueryRunner } from "../0202-query-runner/QueryRunner";
import { EntityManager } from "../0204-entity-manager/EntityManager";
/**
 * Factory used to create different types of repositories.
 */
export declare class RepositoryFactory {
    /**
     * Creates a repository.
     */
    create(manager: EntityManager, metadata: EntityMetadata, queryRunner?: QueryRunner): Repository<any>;
}
