import { Connection } from "../0203-connection/Connection";
import { EntityManager } from "./EntityManager";
import { QueryRunner } from "../0202-query-runner/QueryRunner";
/**
 * Helps to create entity managers.
 */
export declare class EntityManagerFactory {
    /**
     * Creates a new entity manager depend on a given connection's driver.
     */
    create(connection: Connection, queryRunner?: QueryRunner): EntityManager;
}
