import { ColumnOptions } from "../../index";
/**
 * Sets for entity to use table inheritance pattern.
 */
export declare function TableInheritance(options?: {
    pattern?: "STI";
    column?: string | ColumnOptions;
}): (target: Function) => void;
