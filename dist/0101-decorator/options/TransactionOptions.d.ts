import { IsolationLevel } from "../../0201-driver/types/IsolationLevel";
export interface TransactionOptions {
    connectionName?: string;
    isolation?: IsolationLevel;
}
