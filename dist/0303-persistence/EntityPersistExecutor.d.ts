import { ObjectLiteral } from "../common/ObjectLiteral";
import { SaveOptions } from "../0205-repository/SaveOptions";
import { RemoveOptions } from "../0205-repository/RemoveOptions";
import { QueryRunner } from "../0202-query-runner/QueryRunner";
import { Connection } from "../0203-connection/Connection";
/**
 * Persists a single entity or multiple entities - saves or removes them.
 */
export declare class EntityPersistExecutor {
    protected connection: Connection;
    protected queryRunner: QueryRunner | undefined;
    protected mode: "save" | "remove";
    protected target: Function | string | undefined;
    protected entity: ObjectLiteral | ObjectLiteral[];
    protected options?: SaveOptions & RemoveOptions;
    constructor(connection: Connection, queryRunner: QueryRunner | undefined, mode: "save" | "remove", target: Function | string | undefined, entity: ObjectLiteral | ObjectLiteral[], options?: SaveOptions & RemoveOptions);
    /**
     * Executes persistence operation ob given entity or entities.
     */
    execute(): Promise<void>;
}
