import { Subject } from "../Subject";
import { QueryRunner } from "../../0202-query-runner/QueryRunner";
/**
 * Executes subject operations for materialized-path tree entities.
 */
export declare class MaterializedPathSubjectExecutor {
    protected queryRunner: QueryRunner;
    constructor(queryRunner: QueryRunner);
    /**
     * Executes operations when subject is being inserted.
     */
    insert(subject: Subject): Promise<void>;
}
