import { Connection, SelectQueryBuilder } from "../../index";
/**
 * View options.
 */
export interface ViewOptions {
    /**
     * View name.
     */
    name: string;
    /**
     * View expression.
     */
    expression: string | ((connection: Connection) => SelectQueryBuilder<any>);
    /**
     * Indicates if view is materialized
     */
    materialized?: boolean;
}
