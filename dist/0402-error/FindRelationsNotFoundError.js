"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindRelationsNotFoundError = void 0;
/**
 * Thrown when relations specified in the find options were not found in the entities.
*/
class FindRelationsNotFoundError extends Error {
    constructor(notFoundRelations) {
        super();
        Object.setPrototypeOf(this, FindRelationsNotFoundError.prototype);
        if (notFoundRelations.length === 1) {
            this.message = `Relation "${notFoundRelations[0]}" was not found, please check if it is correct and really exist in your entity.`;
        }
        else {
            this.message = `Relations ${notFoundRelations.map(relation => `"${relation}"`).join(", ")} were not found, please check if relations are correct and they exist in your entities.`;
        }
    }
}
exports.FindRelationsNotFoundError = FindRelationsNotFoundError;
