"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationCount = void 0;
const index_1 = require("../../index");
/**
 * Holds a number of children in the closure table of the column.
 *
 * @deprecated Do not use this decorator, it may be removed in the future versions
 */
function RelationCount(relation, alias, queryBuilderFactory) {
    return function (object, propertyName) {
        index_1.getMetadataArgsStorage().relationCounts.push({
            target: object.constructor,
            propertyName: propertyName,
            relation: relation,
            alias: alias,
            queryBuilderFactory: queryBuilderFactory
        });
    };
}
exports.RelationCount = RelationCount;
