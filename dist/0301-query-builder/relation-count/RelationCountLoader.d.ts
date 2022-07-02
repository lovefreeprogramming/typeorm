import { Connection } from "../../0203-connection/Connection";
import { RelationCountAttribute } from "./RelationCountAttribute";
import { RelationCountLoadResult } from "./RelationCountLoadResult";
import { QueryRunner } from "../../0202-query-runner/QueryRunner";
export declare class RelationCountLoader {
    protected connection: Connection;
    protected queryRunner: QueryRunner | undefined;
    protected relationCountAttributes: RelationCountAttribute[];
    constructor(connection: Connection, queryRunner: QueryRunner | undefined, relationCountAttributes: RelationCountAttribute[]);
    load(rawEntities: any[]): Promise<RelationCountLoadResult[]>;
}
