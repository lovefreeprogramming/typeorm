"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const index_1 = require("../../index");
/**
 * Marks entity to work like a tree.
 * Tree pattern that will be used for the tree entity should be specified.
 * @TreeParent decorator must be used in tree entities.
 * TreeRepository can be used to manipulate with tree entities.
 */
function Tree(type) {
    return function (target) {
        index_1.getMetadataArgsStorage().trees.push({
            target: target,
            type: type
        });
    };
}
exports.Tree = Tree;
