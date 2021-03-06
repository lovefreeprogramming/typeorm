"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionColumn = void 0;
const index_1 = require("../../index");
/**
 * This column will store a number - version of the entity.
 * Every time your entity will be persisted, this number will be increased by one -
 * so you can organize visioning and update strategies of your entity.
 */
function VersionColumn(options) {
    return function (object, propertyName) {
        index_1.getMetadataArgsStorage().columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: "version",
            options: options || {}
        });
    };
}
exports.VersionColumn = VersionColumn;
