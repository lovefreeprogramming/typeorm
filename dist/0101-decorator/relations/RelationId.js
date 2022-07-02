"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationId = void 0;
const index_1 = require("../../index");
/**
 * Special decorator used to extract relation id into separate entity property.
 *
 * @experimental
 */
function RelationId(relation, alias, queryBuilderFactory) {
    return function (object, propertyName) {
        index_1.getMetadataArgsStorage().relationIds.push({
            target: object.constructor,
            propertyName: propertyName,
            relation: relation,
            alias: alias,
            queryBuilderFactory: queryBuilderFactory
        });
    };
}
exports.RelationId = RelationId;
