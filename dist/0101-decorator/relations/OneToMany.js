"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneToMany = void 0;
const index_1 = require("../../index");
/**
 * One-to-many relation allows to create type of relation when Entity2 can have multiple instances of Entity1.
 * Entity1 have only one Entity2. Entity1 is an owner of the relationship, and storages Entity2 id on its own side.
 */
function OneToMany(typeFunctionOrTarget, inverseSide, options) {
    return function (object, propertyName) {
        if (!options)
            options = {};
        // now try to determine it its lazy relation
        let isLazy = options && options.lazy === true ? true : false;
        if (!isLazy && Reflect && Reflect.getMetadata) { // automatic determination
            const reflectedType = Reflect.getMetadata("design:type", object, propertyName);
            if (reflectedType && typeof reflectedType.name === "string" && reflectedType.name.toLowerCase() === "promise")
                isLazy = true;
        }
        index_1.getMetadataArgsStorage().relations.push({
            target: object.constructor,
            propertyName: propertyName,
            // propertyType: reflectedType,
            isLazy: isLazy,
            relationType: "one-to-many",
            type: typeFunctionOrTarget,
            inverseSideProperty: inverseSide,
            options: options
        });
    };
}
exports.OneToMany = OneToMany;
