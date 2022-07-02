"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const index_1 = require("../../index");
const CannotReflectMethodParameterTypeError_1 = require("../../0402-error/CannotReflectMethodParameterTypeError");
/**
 * Injects transaction's repository into the method wrapped with @Transaction decorator.
 */
function TransactionRepository(entityType) {
    // @ts-ignore
    return (object, methodName, index) => {
        // get repository type
        let repositoryType;
        try {
            // @ts-ignore
            repositoryType = Reflect.getOwnMetadata("design:paramtypes", object, methodName)[index];
        }
        catch (err) {
            throw new CannotReflectMethodParameterTypeError_1.CannotReflectMethodParameterTypeError(object.constructor, methodName);
        }
        index_1.getMetadataArgsStorage().transactionRepositories.push({
            target: object.constructor,
            methodName,
            index,
            repositoryType,
            entityType,
        });
    };
}
exports.TransactionRepository = TransactionRepository;
