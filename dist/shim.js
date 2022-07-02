"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultNamingStrategy = exports.AdvancedConsoleLogger = exports.getManager = exports.Brackets = exports.getConnection = exports.Index = exports.Generated = exports.TreeParent = exports.TreeLevelColumn = exports.TreeChildrenCount = exports.TreeChildren = exports.Tree = exports.RelationId = exports.RelationCount = exports.OneToOne = exports.OneToMany = exports.ManyToOne = exports.ManyToMany = exports.JoinTable = exports.JoinColumn = exports.EventSubscriber = exports.BeforeUpdate = exports.BeforeRemove = exports.BeforeInsert = exports.AfterUpdate = exports.AfterRemove = exports.AfterLoad = exports.AfterInsert = exports.TableInheritance = exports.Entity = exports.ViewEntity = exports.ChildEntity = exports.VersionColumn = exports.UpdateDateColumn = exports.PrimaryGeneratedColumn = exports.PrimaryColumn = exports.ViewColumn = exports.ObjectIdColumn = exports.CreateDateColumn = exports.Column = void 0;
function Column(typeOrOptions, options) {
    return function (object, propertyName) { };
}
exports.Column = Column;
function CreateDateColumn(options) {
    return function (object, propertyName) { };
}
exports.CreateDateColumn = CreateDateColumn;
function ObjectIdColumn(columnOptions) {
    return function (object, propertyName) {
    };
}
exports.ObjectIdColumn = ObjectIdColumn;
function ViewColumn(columnOptions) {
    return function (object, propertyName) {
    };
}
exports.ViewColumn = ViewColumn;
function PrimaryColumn(typeOrOptions, options) {
    return function (object, propertyName) {
    };
}
exports.PrimaryColumn = PrimaryColumn;
function PrimaryGeneratedColumn(options) {
    return function (object, propertyName) {
    };
}
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
function UpdateDateColumn(options) {
    return function (object, propertyName) {
    };
}
exports.UpdateDateColumn = UpdateDateColumn;
function VersionColumn(options) {
    return function (object, propertyName) {
    };
}
exports.VersionColumn = VersionColumn;
// entities
function ChildEntity(tableName, options) {
    return function (object) {
    };
}
exports.ChildEntity = ChildEntity;
function ViewEntity(name, options) {
    return function (object) {
    };
}
exports.ViewEntity = ViewEntity;
function Entity(name, options) {
    return function (object) {
    };
}
exports.Entity = Entity;
function TableInheritance(type) {
    return function (object) {
    };
}
exports.TableInheritance = TableInheritance;
// listeners
function AfterInsert() {
    return function (object, propertyName) {
    };
}
exports.AfterInsert = AfterInsert;
function AfterLoad() {
    return function (object, propertyName) {
    };
}
exports.AfterLoad = AfterLoad;
function AfterRemove() {
    return function (object, propertyName) {
    };
}
exports.AfterRemove = AfterRemove;
function AfterUpdate() {
    return function (object, propertyName) {
    };
}
exports.AfterUpdate = AfterUpdate;
function BeforeInsert() {
    return function (object, propertyName) {
    };
}
exports.BeforeInsert = BeforeInsert;
function BeforeRemove() {
    return function (object, propertyName) {
    };
}
exports.BeforeRemove = BeforeRemove;
function BeforeUpdate() {
    return function (object, propertyName) {
    };
}
exports.BeforeUpdate = BeforeUpdate;
function EventSubscriber() {
    return function (object, propertyName) {
    };
}
exports.EventSubscriber = EventSubscriber;
// relations
function JoinColumn(options) {
    return function (object, propertyName) {
    };
}
exports.JoinColumn = JoinColumn;
function JoinTable(options) {
    return function (object, propertyName) {
    };
}
exports.JoinTable = JoinTable;
function ManyToMany(typeFunction, inverseSideOrOptions, options) {
    return function (object, propertyName) {
    };
}
exports.ManyToMany = ManyToMany;
function ManyToOne(typeFunction, inverseSideOrOptions, options) {
    return function (object, propertyName) {
    };
}
exports.ManyToOne = ManyToOne;
function OneToMany(typeFunction, inverseSideOrOptions, options) {
    return function (object, propertyName) {
    };
}
exports.OneToMany = OneToMany;
function OneToOne(typeFunction, inverseSideOrOptions, options) {
    return function (object, propertyName) {
    };
}
exports.OneToOne = OneToOne;
function RelationCount(relation) {
    return function (object, propertyName) {
    };
}
exports.RelationCount = RelationCount;
function RelationId(relation) {
    return function (object, propertyName) {
    };
}
exports.RelationId = RelationId;
// tree
function Tree(name, options) {
    return function (object) {
    };
}
exports.Tree = Tree;
function TreeChildren(options) {
    return function (object, propertyName) {
    };
}
exports.TreeChildren = TreeChildren;
function TreeChildrenCount(options) {
    return function (object, propertyName) {
    };
}
exports.TreeChildrenCount = TreeChildrenCount;
function TreeLevelColumn() {
    return function (object, propertyName) {
    };
}
exports.TreeLevelColumn = TreeLevelColumn;
function TreeParent(options) {
    return function (object, propertyName) {
    };
}
exports.TreeParent = TreeParent;
// other
function Generated(options) {
    return function (object, propertyName) {
    };
}
exports.Generated = Generated;
function Index(options) {
    return function (object, propertyName) {
    };
}
exports.Index = Index;
function getConnection() {
}
exports.getConnection = getConnection;
function Brackets() {
}
exports.Brackets = Brackets;
function getManager() {
}
exports.getManager = getManager;
function AdvancedConsoleLogger() { }
exports.AdvancedConsoleLogger = AdvancedConsoleLogger;
function DefaultNamingStrategy() {
}
exports.DefaultNamingStrategy = DefaultNamingStrategy;
