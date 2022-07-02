"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionManager = void 0;
const index_1 = require("../../index");
/**
 * Injects transaction's entity manager into the method wrapped with @Transaction decorator.
 */
function TransactionManager() {
    return function (object, methodName, index) {
        index_1.getMetadataArgsStorage().transactionEntityManagers.push({
            target: object.constructor,
            methodName: methodName,
            index: index,
        });
    };
}
exports.TransactionManager = TransactionManager;
