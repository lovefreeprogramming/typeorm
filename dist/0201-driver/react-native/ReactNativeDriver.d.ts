import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import { ReactNativeConnectionOptions } from "./ReactNativeConnectionOptions";
import { QueryRunner } from "../../0202-query-runner/QueryRunner";
import { Connection } from "../../0203-connection/Connection";
export declare class ReactNativeDriver extends AbstractSqliteDriver {
    options: ReactNativeConnectionOptions;
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
