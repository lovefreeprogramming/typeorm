import { RelationIdAttribute } from "./RelationIdAttribute";
import { Connection } from "../../0203-connection/Connection";
import { RelationIdLoadResult } from "./RelationIdLoadResult";
import { QueryRunner } from "../../0202-query-runner/QueryRunner";
export declare class RelationIdLoader {
    protected connection: Connection;
    protected queryRunner: QueryRunner | undefined;
    protected relationIdAttributes: RelationIdAttribute[];
    constructor(connection: Connection, queryRunner: QueryRunner | undefined, relationIdAttributes: RelationIdAttribute[]);
    load(rawEntities: any[]): Promise<RelationIdLoadResult[]>;
}
