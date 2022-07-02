import { TableColumnOptions } from "../options/TableColumnOptions";
import { ColumnMetadata } from "../../0103-metadata/ColumnMetadata";
import { Driver } from "../../0201-driver/Driver";
export declare class TableUtils {
    static createTableColumnOptions(columnMetadata: ColumnMetadata, driver: Driver): TableColumnOptions;
}
