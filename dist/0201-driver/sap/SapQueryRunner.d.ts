/// <reference types="node" />
import { ReadStream } from "../../platform/PlatformTools";
import { BaseQueryRunner } from "../../0202-query-runner/BaseQueryRunner";
import { QueryRunner } from "../../0202-query-runner/QueryRunner";
import { Table } from "../../0107-schema-builder/table/Table";
import { TableCheck } from "../../0107-schema-builder/table/TableCheck";
import { TableColumn } from "../../0107-schema-builder/table/TableColumn";
import { TableExclusion } from "../../0107-schema-builder/table/TableExclusion";
import { TableForeignKey } from "../../0107-schema-builder/table/TableForeignKey";
import { TableIndex } from "../../0107-schema-builder/table/TableIndex";
import { TableUnique } from "../../0107-schema-builder/table/TableUnique";
import { View } from "../../0107-schema-builder/view/View";
import { Query } from "../Query";
import { IsolationLevel } from "../types/IsolationLevel";
import { SapDriver } from "./SapDriver";
/**
 * Runs queries on a single SQL Server database connection.
 */
export declare class SapQueryRunner extends BaseQueryRunner implements QueryRunner {
    /**
     * Database driver used by connection.
     */
    driver: SapDriver;
    /**
     * Last executed query in a transaction.
     * This is needed because we cannot rely on parallel queries because we use second query
     * to select CURRENT_IDENTITY_VALUE()
     */
    protected queryResponsibilityChain: Promise<any>[];
    /**
     * Promise used to obtain a database connection from a pool for a first time.
     */
    protected databaseConnectionPromise: Promise<any>;
    constructor(driver: SapDriver, mode?: "master" | "slave");
    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<any>;
    /**
     * Releases used database connection.
     * You cannot use query runner methods once its released.
     */
    release(): Promise<void>;
    /**
     * Starts transaction.
     */
    startTransaction(isolationLevel?: IsolationLevel): Promise<void>;
    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    commitTransaction(): Promise<void>;
    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    rollbackTransaction(): Promise<void>;
    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[]): Promise<any>;
    /**
     * Returns raw data stream.
     */
    stream(query: string, parameters?: any[], onEnd?: Function, onError?: Function): Promise<ReadStream>;
    /**
     * Returns all available database names including system databases.
     */
    getDatabases(): Promise<string[]>;
    /**
     * Returns all available schema names including system schemas.
     * If database parameter specified, returns schemas of that database.
     */
    getSchemas(database?: string): Promise<string[]>;
    /**
     * Checks if database with the given name exist.
     */
    hasDatabase(database: string): Promise<boolean>;
    /**
     * Checks if schema with the given name exist.
     */
    hasSchema(schema: string): Promise<boolean>;
    /**
     * Checks if table with the given name exist in the database.
     */
    hasTable(tableOrName: Table | string): Promise<boolean>;
    /**
     * Checks if column with the given name exist in the given table.
     */
    hasColumn(tableOrName: Table | string, columnName: string): Promise<boolean>;
    /**
     * Creates a new database.
     */
    createDatabase(database: string, ifNotExist?: boolean): Promise<void>;
    /**
     * Drops database.
     */
    dropDatabase(database: string, ifExist?: boolean): Promise<void>;
    /**
     * Creates a new table schema.
     */
    createSchema(schema: string, ifNotExist?: boolean): Promise<void>;
    /**
     * Drops table schema
     */
    dropSchema(schemaPath: string, ifExist?: boolean, isCascade?: boolean): Promise<void>;
    /**
     * Creates a new table.
     */
    createTable(table: Table, ifNotExist?: boolean, createForeignKeys?: boolean, createIndices?: boolean): Promise<void>;
    /**
     * Drops the table.
     */
    dropTable(tableOrName: Table | string, ifExist?: boolean, dropForeignKeys?: boolean, dropIndices?: boolean): Promise<void>;
    /**
     * Creates a new view.
     */
    createView(view: View): Promise<void>;
    /**
     * Drops the view.
     */
    dropView(target: View | string): Promise<void>;
    /**
     * Renames a table.
     */
    renameTable(oldTableOrName: Table | string, newTableName: string): Promise<void>;
    /**
     * Creates a new column from the column in the table.
     */
    addColumn(tableOrName: Table | string, column: TableColumn): Promise<void>;
    /**
     * Creates a new columns from the column in the table.
     */
    addColumns(tableOrName: Table | string, columns: TableColumn[]): Promise<void>;
    /**
     * Renames column in the given table.
     */
    renameColumn(tableOrName: Table | string, oldTableColumnOrName: TableColumn | string, newTableColumnOrName: TableColumn | string): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumn(tableOrName: Table | string, oldTableColumnOrName: TableColumn | string, newColumn: TableColumn): Promise<void>;
    /**
     * Changes a column in the table.
     */
    changeColumns(tableOrName: Table | string, changedColumns: {
        newColumn: TableColumn;
        oldColumn: TableColumn;
    }[]): Promise<void>;
    /**
     * Drops column in the table.
     */
    dropColumn(tableOrName: Table | string, columnOrName: TableColumn | string): Promise<void>;
    /**
     * Drops the columns in the table.
     */
    dropColumns(tableOrName: Table | string, columns: TableColumn[]): Promise<void>;
    /**
     * Creates a new primary key.
     */
    createPrimaryKey(tableOrName: Table | string, columnNames: string[]): Promise<void>;
    /**
     * Updates composite primary keys.
     */
    updatePrimaryKeys(tableOrName: Table | string, columns: TableColumn[]): Promise<void>;
    /**
     * Drops a primary key.
     */
    dropPrimaryKey(tableOrName: Table | string): Promise<void>;
    /**
     * Creates a new unique constraint.
     */
    createUniqueConstraint(tableOrName: Table | string, uniqueConstraint: TableUnique): Promise<void>;
    /**
     * Creates a new unique constraints.
     */
    createUniqueConstraints(tableOrName: Table | string, uniqueConstraints: TableUnique[]): Promise<void>;
    /**
     * Drops unique constraint.
     */
    dropUniqueConstraint(tableOrName: Table | string, uniqueOrName: TableUnique | string): Promise<void>;
    /**
     * Drops an unique constraints.
     */
    dropUniqueConstraints(tableOrName: Table | string, uniqueConstraints: TableUnique[]): Promise<void>;
    /**
     * Creates a new check constraint.
     */
    createCheckConstraint(tableOrName: Table | string, checkConstraint: TableCheck): Promise<void>;
    /**
     * Creates a new check constraints.
     */
    createCheckConstraints(tableOrName: Table | string, checkConstraints: TableCheck[]): Promise<void>;
    /**
     * Drops check constraint.
     */
    dropCheckConstraint(tableOrName: Table | string, checkOrName: TableCheck | string): Promise<void>;
    /**
     * Drops check constraints.
     */
    dropCheckConstraints(tableOrName: Table | string, checkConstraints: TableCheck[]): Promise<void>;
    /**
     * Creates a new exclusion constraint.
     */
    createExclusionConstraint(tableOrName: Table | string, exclusionConstraint: TableExclusion): Promise<void>;
    /**
     * Creates a new exclusion constraints.
     */
    createExclusionConstraints(tableOrName: Table | string, exclusionConstraints: TableExclusion[]): Promise<void>;
    /**
     * Drops exclusion constraint.
     */
    dropExclusionConstraint(tableOrName: Table | string, exclusionOrName: TableExclusion | string): Promise<void>;
    /**
     * Drops exclusion constraints.
     */
    dropExclusionConstraints(tableOrName: Table | string, exclusionConstraints: TableExclusion[]): Promise<void>;
    /**
     * Creates a new foreign key.
     */
    createForeignKey(tableOrName: Table | string, foreignKey: TableForeignKey): Promise<void>;
    /**
     * Creates a new foreign keys.
     */
    createForeignKeys(tableOrName: Table | string, foreignKeys: TableForeignKey[]): Promise<void>;
    /**
     * Drops a foreign key from the table.
     */
    dropForeignKey(tableOrName: Table | string, foreignKeyOrName: TableForeignKey | string): Promise<void>;
    /**
     * Drops a foreign keys from the table.
     */
    dropForeignKeys(tableOrName: Table | string, foreignKeys: TableForeignKey[]): Promise<void>;
    /**
     * Creates a new index.
     */
    createIndex(tableOrName: Table | string, index: TableIndex): Promise<void>;
    /**
     * Creates a new indices
     */
    createIndices(tableOrName: Table | string, indices: TableIndex[]): Promise<void>;
    /**
     * Drops an index.
     */
    dropIndex(tableOrName: Table | string, indexOrName: TableIndex | string): Promise<void>;
    /**
     * Drops an indices from the table.
     */
    dropIndices(tableOrName: Table | string, indices: TableIndex[]): Promise<void>;
    /**
     * Clears all table contents.
     * Note: this operation uses SQL's TRUNCATE query which cannot be reverted in transactions.
     */
    clearTable(tablePath: string): Promise<void>;
    /**
     * Removes all tables from the currently connected database.
     */
    clearDatabase(): Promise<void>;
    /**
     * Return current database.
     */
    protected getCurrentDatabase(): Promise<string>;
    /**
     * Return current schema.
     */
    protected getCurrentSchema(): Promise<string>;
    protected loadViews(viewNames: string[]): Promise<View[]>;
    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     */
    protected loadTables(tableNames: string[]): Promise<Table[]>;
    /**
     * Builds and returns SQL for create table.
     */
    protected createTableSql(table: Table, createForeignKeys?: boolean): Query;
    /**
     * Builds drop table sql.
     */
    protected dropTableSql(tableOrName: Table | string, ifExist?: boolean): Query;
    protected createViewSql(view: View): Query;
    protected insertViewDefinitionSql(view: View): Promise<Query>;
    /**
     * Builds drop view sql.
     */
    protected dropViewSql(viewOrPath: View | string): Query;
    /**
     * Builds remove view sql.
     */
    protected deleteViewDefinitionSql(viewOrPath: View | string): Promise<Query>;
    protected addColumnSql(table: Table, column: TableColumn): string;
    protected dropColumnSql(table: Table, column: TableColumn): string;
    /**
     * Builds create index sql.
     */
    protected createIndexSql(table: Table, index: TableIndex): Query;
    /**
     * Builds drop index sql.
     */
    protected dropIndexSql(table: Table, indexOrName: TableIndex | string): Query;
    /**
     * Builds create primary key sql.
     */
    protected createPrimaryKeySql(table: Table, columnNames: string[]): Query;
    /**
     * Builds drop primary key sql.
     */
    protected dropPrimaryKeySql(table: Table): Query;
    /**
     * Builds create check constraint sql.
     */
    protected createCheckConstraintSql(table: Table, checkConstraint: TableCheck): Query;
    /**
     * Builds drop check constraint sql.
     */
    protected dropCheckConstraintSql(table: Table, checkOrName: TableCheck | string): Query;
    /**
     * Builds create foreign key sql.
     */
    protected createForeignKeySql(tableOrName: Table | string, foreignKey: TableForeignKey): Query;
    /**
     * Builds drop foreign key sql.
     */
    protected dropForeignKeySql(tableOrName: Table | string, foreignKeyOrName: TableForeignKey | string): Query;
    /**
     * Escapes given table or view path.
     */
    protected escapePath(target: Table | View | string, disableEscape?: boolean): string;
    /**
     * Returns object with table schema and table name.
     */
    protected parseTableName(target: Table | string): {
        schema: string;
        tableName: string;
    };
    /**
     * Concat database name and schema name to the foreign key name.
     * Needs because FK name is relevant to the schema and database.
     */
    protected buildForeignKeyName(fkName: string, schemaName: string | undefined, dbName: string | undefined): string;
    /**
     * Removes parenthesis around default value.
     * Sql server returns default value with parenthesis around, e.g.
     *  ('My text') - for string
     *  ((1)) - for number
     *  (newsequentialId()) - for function
     */
    protected removeParenthesisFromDefault(defaultValue: any): any;
    /**
     * Builds a query for create column.
     */
    protected buildCreateColumnSql(column: TableColumn): string;
}
