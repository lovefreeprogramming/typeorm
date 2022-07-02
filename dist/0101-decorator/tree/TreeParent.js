"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeParent = void 0;
const index_1 = require("../../index");
/**
 * Marks a entity property as a parent of the tree.
 * "Tree parent" indicates who owns (is a parent) of this entity in tree structure.
 */
function TreeParent() {
    return function (object, propertyName) {
        // now try to determine it its lazy relation
        const reflectedType = Reflect && Reflect.getMetadata ? Reflect.getMetadata("design:type", object, propertyName) : undefined;
        const isLazy = (reflectedType && typeof reflectedType.name === "string" && reflectedType.name.toLowerCase() === "promise") || false;
        index_1.getMetadataArgsStorage().relations.push({
            isTreeParent: true,
            target: object.constructor,
            propertyName: propertyName,
            isLazy: isLazy,
            relationType: "many-to-one",
            type: () => object.constructor,
            options: {}
        });
    };
}
exports.TreeParent = TreeParent;
