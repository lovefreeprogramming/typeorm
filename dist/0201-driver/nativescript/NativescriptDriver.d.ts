import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import { NativescriptConnectionOptions } from "./NativescriptConnectionOptions";
import { QueryRunner } from "../../0202-query-runner/QueryRunner";
import { Connection } from "../../0203-connection/Connection";
import { ColumnType } from "../types/ColumnTypes";
/**
 * Organizes communication with sqlite DBMS within Nativescript.
 */
export declare class NativescriptDriver extends AbstractSqliteDriver {
    /**
     * Connection options.
     */
    options: NativescriptConnectionOptions;
    /**
     * Nativescript driver module
     * this is most likely `nativescript-sqlite`
     * but user can pass his own
     */
    driver: any;
    constructor(connection: Connection);
    /**
     * Closes connection with database.
     */
    disconnect(): Promise<void>;
    /**
     * Creates a query runner used to execute database queries.
     */
    createQueryRunner(mode?: "master" | "slave"): QueryRunner;
    normalizeType(column: {
        type?: ColumnType;
        length?: number | string;
        precision?: number | null;
        scale?: number;
    }): string;
    /**
     * Creates connection with the database.
     */
    protected createDatabaseConnection(): Promise<void>;
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void;
}
