import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import { CordovaConnectionOptions } from "./CordovaConnectionOptions";
import { QueryRunner } from "../../0202-query-runner/QueryRunner";
import { Connection } from "../../0203-connection/Connection";
export declare class CordovaDriver extends AbstractSqliteDriver {
    options: CordovaConnectionOptions;
    constructor(connection: Connection);
    /**
     * Closes connection with database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a query runner used to execute database queries.
     */
    createQueryRunner(mode?: "master" | "slave"): QueryRunner;
    /**
     * Creates connection with the database.
     */
    protected createDatabaseConnection(): Promise<void>;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
}
