import { ObjectLiteral } from "../common/ObjectLiteral";
import { QueryRunner } from "../0202-query-runner/QueryRunner";
import { QueryExpressionMap } from "./QueryExpressionMap";
import { ColumnMetadata } from "../0103-metadata/ColumnMetadata";
import { UpdateResult } from "./result/UpdateResult";
import { InsertResult } from "./result/InsertResult";
/**
 * Updates entity with returning results in the entity insert and update operations.
 */
export declare class ReturningResultsEntityUpdator {
    protected queryRunner: QueryRunner;
    protected expressionMap: QueryExpressionMap;
    constructor(queryRunner: QueryRunner, expressionMap: QueryExpressionMap);
    /**
     * Updates entities with a special columns after updation query execution.
     */
    update(updateResult: UpdateResult, entities: ObjectLiteral[]): Promise<void>;
    /**
     * Updates entities with a special columns after insertion query execution.
     */
    insert(insertResult: InsertResult, entities: ObjectLiteral[]): Promise<void>;
    /**
     * Columns we need to be returned from the database when we insert entity.
     */
    getInsertionReturningColumns(): ColumnMetadata[];
    /**
     * Columns we need to be returned from the database when we update entity.
     */
    getUpdationReturningColumns(): ColumnMetadata[];
}
