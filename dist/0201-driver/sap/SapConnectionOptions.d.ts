import { BaseConnectionOptions } from "../../0203-connection/BaseConnectionOptions";
import { SapConnectionCredentialsOptions } from "./SapConnectionCredentialsOptions";
/**
 * SAP Hana specific connection options.
 */
export interface SapConnectionOptions extends BaseConnectionOptions, SapConnectionCredentialsOptions {
    /**
     * Database type.
     */
    readonly type: "sap";
    /**
     * Database schema.
     */
    readonly schema?: string;
}
