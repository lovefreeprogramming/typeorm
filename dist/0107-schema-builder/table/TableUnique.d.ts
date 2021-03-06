import { TableUniqueOptions } from "../options/TableUniqueOptions";
import { UniqueMetadata } from "../../0103-metadata/UniqueMetadata";
/**
 * Database's table unique constraint stored in this class.
 */
export declare class TableUnique {
    /**
     * Constraint name.
     */
    name?: string;
    /**
     * Columns that contains this constraint.
     */
    columnNames: string[];
    constructor(options: TableUniqueOptions);
    /**
     * Creates a new copy of this constraint with exactly same properties.
     */
    clone(): TableUnique;
    /**
     * Creates unique from the unique metadata object.
     */
    static create(uniqueMetadata: UniqueMetadata): TableUnique;
}
