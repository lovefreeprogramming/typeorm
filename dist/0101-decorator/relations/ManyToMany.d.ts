import { ObjectType, RelationOptions } from "../../index";
/**
 * Many-to-many is a type of relationship when Entity1 can have multiple instances of Entity2, and Entity2 can have
 * multiple instances of Entity1. To achieve it, this type of relation creates a junction table, where it storage
 * entity1 and entity2 ids. This is owner side of the relationship.
 */
export declare function ManyToMany<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), options?: RelationOptions): Function;
/**
 * Many-to-many is a type of relationship when Entity1 can have multiple instances of Entity2, and Entity2 can have
 * multiple instances of Entity1. To achieve it, this type of relation creates a junction table, where it storage
 * entity1 and entity2 ids. This is owner side of the relationship.
 */
export declare function ManyToMany<T>(typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>), inverseSide?: string | ((object: T) => any), options?: RelationOptions): Function;
