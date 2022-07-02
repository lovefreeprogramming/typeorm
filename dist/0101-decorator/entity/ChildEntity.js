"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildEntity = void 0;
const index_1 = require("../../index");
/**
 * Special type of the table used in the single-table inherited tables.
 */
function ChildEntity(discriminatorValue) {
    return function (target) {
        // register a table metadata
        index_1.getMetadataArgsStorage().tables.push({
            target: target,
            type: "entity-child",
        });
        // register discriminator value if it was provided
        if (discriminatorValue) {
            index_1.getMetadataArgsStorage().discriminatorValues.push({
                target: target,
                value: discriminatorValue
            });
        }
    };
}
exports.ChildEntity = ChildEntity;
