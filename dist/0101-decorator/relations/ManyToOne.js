"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManyToOne = void 0;
const index_1 = require("../../index");
/**
 * Many-to-one relation allows to create type of relation when Entity1 can have single instance of Entity2, but
 * Entity2 can have a multiple instances of Entity1. Entity1 is an owner of the relationship, and storages Entity2 id
 * on its own side.
 */
function ManyToOne(typeFunctionOrTarget, inverseSideOrOptions, options) {
    // normalize parameters
    let inverseSideProperty;
    if (typeof inverseSideOrOptions === "object") {
        options = inverseSideOrOptions;
    }
    else {
        inverseSideProperty = inverseSideOrOptions;
    }
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
            relationType: "many-to-one",
            isLazy: isLazy,
            type: typeFunctionOrTarget,
            inverseSideProperty: inverseSideProperty,
            options: options
        });
    };
}
exports.ManyToOne = ManyToOne;
