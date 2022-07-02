import { BaseConnectionOptions } from "../../0203-connection/BaseConnectionOptions";
/**
 * Sqlite-specific connection options.
 */
export interface ExpoConnectionOptions extends BaseConnectionOptions {
    /**
     * Database type.
     */
    readonly type: "expo";
    /**
     * Database name.
     */
    readonly database: string;
}
