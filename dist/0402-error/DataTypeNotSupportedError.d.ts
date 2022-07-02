import { ColumnType } from "../0201-driver/types/ColumnTypes";
import { DatabaseType } from "../0201-driver/types/DatabaseType";
import { ColumnMetadata } from "../0103-metadata/ColumnMetadata";
export declare class DataTypeNotSupportedError extends Error {
    name: string;
    constructor(column: ColumnMetadata, dataType: ColumnType, database?: DatabaseType);
}
