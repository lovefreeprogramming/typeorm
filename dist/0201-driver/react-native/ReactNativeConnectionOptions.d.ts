import { BaseConnectionOptions } from "../../0203-connection/BaseConnectionOptions";
/**
 * Sqlite-specific connection options.
 */
export interface ReactNativeConnectionOptions extends BaseConnectionOptions {
    /**
     * Database type.
     */
    readonly type: "react-native";
    /**
     * Database name.
     */
    readonly database: string;
    /**
     * Storage Location
     */
    readonly location: string;
}
