"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewColumn = void 0;
const index_1 = require("../../index");
/**
 * ViewColumn decorator is used to mark a specific class property as a view column.
 */
function ViewColumn() {
    return function (object, propertyName) {
        index_1.getMetadataArgsStorage().columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: "regular",
            options: {}
        });
    };
}
exports.ViewColumn = ViewColumn;
