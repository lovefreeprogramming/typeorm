"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeLevelColumn = void 0;
const index_1 = require("../../index");
/**
 * Creates a "level"/"length" column to the table that holds a closure table.
 */
function TreeLevelColumn() {
    return function (object, propertyName) {
        index_1.getMetadataArgsStorage().columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: "treeLevel",
            options: {}
        });
    };
}
exports.TreeLevelColumn = TreeLevelColumn;
