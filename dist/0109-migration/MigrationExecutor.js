"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationExecutor = void 0;
const Table_1 = require("../0107-schema-builder/table/Table");
const Migration_1 = require("./Migration");
const PromiseUtils_1 = require("../util/PromiseUtils");
const SqlServerDriver_1 = require("../0201-driver/sqlserver/SqlServerDriver");
const MssqlParameter_1 = require("../0201-driver/sqlserver/MssqlParameter");
const MongoDriver_1 = require("../0201-driver/mongodb/MongoDriver");
/**
 * Executes migrations: runs pending and reverts previously executed migrations.
 */
class MigrationExecutor {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connection, queryRunner) {
        this.connection = connection;
        this.queryRunner = queryRunner;
        // -------------------------------------------------------------------------
        // Public Properties
        // -------------------------------------------------------------------------
        /**
         * Indicates how migrations should be run in transactions.
         *   all: all migrations are run in a single transaction
         *   none: all migrations are run without a transaction
         *   each: each migration is run in a separate transaction
         */
        this.transaction = "all";
        const options = this.connection.driver.options;
        this.migrationsTableName = connection.options.migrationsTableName || "migrations";
        this.migrationsTable = this.connection.driver.buildTableName(this.migrationsTableName, options.schema, options.database);
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Tries to execute a single migration given.
     */
    async executeMigration(migration) {
        return this.withQueryRunner(async (queryRunner) => {
            await this.createMigrationsTableIfNotExist(queryRunner);
            await migration.instance.up(queryRunner);
            await this.insertExecutedMigration(queryRunner, migration);
            return migration;
        });
    }
    /**
     * Returns an array of all migrations.
     */
    async getAllMigrations() {
        return Promise.resolve(this.getMigrations());
    }
    /**
     * Returns an array of all executed migrations.
     */
    async getExecutedMigrations() {
        return this.withQueryRunner(async (queryRunner) => {
            await this.createMigrationsTableIfNotExist(queryRunner);
            return await this.loadExecutedMigrations(queryRunner);
        });
    }
    /**
     * Returns an array of all pending migrations.
     */
    async getPendingMigrations() {
        const allMigrations = await this.getAllMigrations();
        const executedMigrations = await this.getExecutedMigrations();
        return allMigrations.filter(migration => executedMigrations.find(executedMigration => executedMigration.name === migration.name));
    }
    /**
     * Inserts an executed migration.
     */
    insertMigration(migration) {
        return new Promise((resolve, reject) => {
            this.withQueryRunner(queryRunner => {
                this.insertExecutedMigration(queryRunner, migration)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
    /**
     * Deletes an executed migration.
     */
    deleteMigration(migration) {
        return new Promise((resolve, reject) => {
            this.withQueryRunner(queryRunner => {
                this.deleteExecutedMigration(queryRunner, migration)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
    /**
     * Lists all migrations and whether they have been executed or not
     * returns true if there are unapplied migrations
     */
    async showMigrations() {
        let hasUnappliedMigrations = false;
        const queryRunner = this.queryRunner || this.connection.createQueryRunner("master");
        // create migrations table if its not created yet
        await this.createMigrationsTableIfNotExist(queryRunner);
        // get all migrations that are executed and saved in the database
        const executedMigrations = await this.loadExecutedMigrations(queryRunner);
        // get all user's migrations in the source code
        const allMigrations = this.getMigrations();
        for (const migration of allMigrations) {
            const executedMigration = executedMigrations.find(executedMigration => executedMigration.name === migration.name);
            if (executedMigration) {
                this.connection.logger.logSchemaBuild(` [X] ${migration.name}`);
            }
            else {
                hasUnappliedMigrations = true;
                this.connection.logger.logSchemaBuild(` [ ] ${migration.name}`);
            }
        }
        // if query runner was created by us then release it
        if (!this.queryRunner) {
            await queryRunner.release();
        }
        return hasUnappliedMigrations;
    }
    /**
     * Executes all pending migrations. Pending migrations are migrations that are not yet executed,
     * thus not saved in the database.
     */
    async executePendingMigrations() {
        const queryRunner = this.queryRunner || this.connection.createQueryRunner("master");
        // create migrations table if its not created yet
        await this.createMigrationsTableIfNotExist(queryRunner);
        // get all migrations that are executed and saved in the database
        const executedMigrations = await this.loadExecutedMigrations(queryRunner);
        // get the time when last migration was executed
        let lastTimeExecutedMigration = this.getLatestTimestampMigration(executedMigrations);
        // get all user's migrations in the source code
        const allMigrations = this.getMigrations();
        // variable to store all migrations we did successefuly
        const successMigrations = [];
        // find all migrations that needs to be executed
        const pendingMigrations = allMigrations.filter(migration => {
            // check if we already have executed migration
            const executedMigration = executedMigrations.find(executedMigration => executedMigration.name === migration.name);
            if (executedMigration)
                return false;
            // migration is new and not executed. now check if its timestamp is correct
            // if (lastTimeExecutedMigration && migration.timestamp < lastTimeExecutedMigration.timestamp)
            //     throw new Error(`New migration found: ${migration.name}, however this migration's timestamp is not valid. Migration's timestamp should not be older then migrations already executed in the database.`);
            // every check is passed means that migration was not run yet and we need to run it
            return true;
        });
        // if no migrations are pending then nothing to do here
        if (!pendingMigrations.length) {
            this.connection.logger.logSchemaBuild(`No migrations are pending`);
            // if query runner was created by us then release it
            if (!this.queryRunner)
                await queryRunner.release();
            return [];
        }
        // log information about migration execution
        this.connection.logger.logSchemaBuild(`${executedMigrations.length} migrations are already loaded in the database.`);
        this.connection.logger.logSchemaBuild(`${allMigrations.length} migrations were found in the source code.`);
        if (lastTimeExecutedMigration)
            this.connection.logger.logSchemaBuild(`${lastTimeExecutedMigration.name} is the last executed migration. It was executed on ${new Date(lastTimeExecutedMigration.timestamp).toString()}.`);
        this.connection.logger.logSchemaBuild(`${pendingMigrations.length} migrations are new migrations that needs to be executed.`);
        // start transaction if its not started yet
        let transactionStartedByUs = false;
        if (this.transaction === "all" && !queryRunner.isTransactionActive) {
            await queryRunner.startTransaction();
            transactionStartedByUs = true;
        }
        // run all pending migrations in a sequence
        try {
            await PromiseUtils_1.PromiseUtils.runInSequence(pendingMigrations, async (migration) => {
                if (this.transaction === "each" && !queryRunner.isTransactionActive) {
                    await queryRunner.startTransaction();
                    transactionStartedByUs = true;
                }
                return migration.instance.up(queryRunner)
                    .then(async () => {
                    await this.insertExecutedMigration(queryRunner, migration);
                    // commit transaction if we started it
                    if (this.transaction === "each" && transactionStartedByUs)
                        await queryRunner.commitTransaction();
                })
                    .then(() => {
                    successMigrations.push(migration);
                    this.connection.logger.logSchemaBuild(`Migration ${migration.name} has been executed successfully.`);
                });
            });
            // commit transaction if we started it
            if (this.transaction === "all" && transactionStartedByUs)
                await queryRunner.commitTransaction();
        }
        catch (err) { // rollback transaction if we started it
            if (transactionStartedByUs) {
                try { // we throw original error even if rollback thrown an error
                    await queryRunner.rollbackTransaction();
                }
                catch (rollbackError) { }
            }
            throw err;
        }
        finally {
            // if query runner was created by us then release it
            if (!this.queryRunner)
                await queryRunner.release();
        }
        return successMigrations;
    }
    /**
     * Reverts last migration that were run.
     */
    async undoLastMigration() {
        const queryRunner = this.queryRunner || this.connection.createQueryRunner("master");
        // create migrations table if its not created yet
        await this.createMigrationsTableIfNotExist(queryRunner);
        // get all migrations that are executed and saved in the database
        const executedMigrations = await this.loadExecutedMigrations(queryRunner);
        // get the time when last migration was executed
        let lastTimeExecutedMigration = this.getLatestExecutedMigration(executedMigrations);
        // if no migrations found in the database then nothing to revert
        if (!lastTimeExecutedMigration) {
            this.connection.logger.logSchemaBuild(`No migrations was found in the database. Nothing to revert!`);
            return;
        }
        // get all user's migrations in the source code
        const allMigrations = this.getMigrations();
        // find the instance of the migration we need to remove
        const migrationToRevert = allMigrations.find(migration => migration.name === lastTimeExecutedMigration.name);
        // if no migrations found in the database then nothing to revert
        if (!migrationToRevert)
            throw new Error(`No migration ${lastTimeExecutedMigration.name} was found in the source code. Make sure you have this migration in your codebase and its included in the connection options.`);
        // log information about migration execution
        this.connection.logger.logSchemaBuild(`${executedMigrations.length} migrations are already loaded in the database.`);
        this.connection.logger.logSchemaBuild(`${lastTimeExecutedMigration.name} is the last executed migration. It was executed on ${new Date(lastTimeExecutedMigration.timestamp).toString()}.`);
        this.connection.logger.logSchemaBuild(`Now reverting it...`);
        // start transaction if its not started yet
        let transactionStartedByUs = false;
        if ((this.transaction !== "none") && !queryRunner.isTransactionActive) {
            await queryRunner.startTransaction();
            transactionStartedByUs = true;
        }
        try {
            await migrationToRevert.instance.down(queryRunner);
            await this.deleteExecutedMigration(queryRunner, migrationToRevert);
            this.connection.logger.logSchemaBuild(`Migration ${migrationToRevert.name} has been reverted successfully.`);
            // commit transaction if we started it
            if (transactionStartedByUs)
                await queryRunner.commitTransaction();
        }
        catch (err) { // rollback transaction if we started it
            if (transactionStartedByUs) {
                try { // we throw original error even if rollback thrown an error
                    await queryRunner.rollbackTransaction();
                }
                catch (rollbackError) { }
            }
            throw err;
        }
        finally {
            // if query runner was created by us then release it
            if (!this.queryRunner)
                await queryRunner.release();
        }
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates table "migrations" that will store information about executed migrations.
     */
    async createMigrationsTableIfNotExist(queryRunner) {
        // If driver is mongo no need to create
        if (this.connection.driver instanceof MongoDriver_1.MongoDriver) {
            return;
        }
        const tableExist = await queryRunner.hasTable(this.migrationsTable); // todo: table name should be configurable
        if (!tableExist) {
            await queryRunner.createTable(new Table_1.Table({
                name: this.migrationsTable,
                columns: [
                    {
                        name: "id",
                        type: this.connection.driver.normalizeType({ type: this.connection.driver.mappedDataTypes.migrationId }),
                        isGenerated: true,
                        generationStrategy: "increment",
                        isPrimary: true,
                        isNullable: false
                    },
                    {
                        name: "timestamp",
                        type: this.connection.driver.normalizeType({ type: this.connection.driver.mappedDataTypes.migrationTimestamp }),
                        isPrimary: false,
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: this.connection.driver.normalizeType({ type: this.connection.driver.mappedDataTypes.migrationName }),
                        isNullable: false
                    },
                ]
            }));
        }
    }
    /**
     * Loads all migrations that were executed and saved into the database (sorts by id).
     */
    async loadExecutedMigrations(queryRunner) {
        if (this.connection.driver instanceof MongoDriver_1.MongoDriver) {
            const mongoRunner = queryRunner;
            return await mongoRunner.databaseConnection
                .db(this.connection.driver.database)
                .collection(this.migrationsTableName)
                .find()
                .sort({ "_id": -1 })
                .toArray();
        }
        else {
            const migrationsRaw = await this.connection.manager
                .createQueryBuilder(queryRunner)
                .select()
                .orderBy(this.connection.driver.escape("id"), "DESC")
                .from(this.migrationsTable, this.migrationsTableName)
                .getRawMany();
            return migrationsRaw.map(migrationRaw => {
                return new Migration_1.Migration(parseInt(migrationRaw["id"]), parseInt(migrationRaw["timestamp"]), migrationRaw["name"]);
            });
        }
    }
    /**
     * Gets all migrations that setup for this connection.
     */
    getMigrations() {
        const migrations = this.connection.migrations.map(migration => {
            const migrationClassName = migration.name || migration.constructor.name;
            const migrationTimestamp = parseInt(migrationClassName.substr(-13), 10);
            if (!migrationTimestamp || isNaN(migrationTimestamp)) {
                throw new Error(`${migrationClassName} migration name is wrong. Migration class name should have a JavaScript timestamp appended.`);
            }
            return new Migration_1.Migration(undefined, migrationTimestamp, migrationClassName, migration);
        });
        this.checkForDuplicateMigrations(migrations);
        // sort them by timestamp
        return migrations.sort((a, b) => a.timestamp - b.timestamp);
    }
    checkForDuplicateMigrations(migrations) {
        const migrationNames = migrations.map(migration => migration.name);
        const duplicates = Array.from(new Set(migrationNames.filter((migrationName, index) => migrationNames.indexOf(migrationName) < index)));
        if (duplicates.length > 0) {
            throw Error(`Duplicate migrations: ${duplicates.join(", ")}`);
        }
    }
    /**
     * Finds the latest migration (sorts by timestamp) in the given array of migrations.
     */
    getLatestTimestampMigration(migrations) {
        const sortedMigrations = migrations.map(migration => migration).sort((a, b) => (a.timestamp - b.timestamp) * -1);
        return sortedMigrations.length > 0 ? sortedMigrations[0] : undefined;
    }
    /**
     * Finds the latest migration in the given array of migrations.
     * PRE: Migration array must be sorted by descending id.
     */
    getLatestExecutedMigration(sortedMigrations) {
        return sortedMigrations.length > 0 ? sortedMigrations[0] : undefined;
    }
    /**
     * Inserts new executed migration's data into migrations table.
     */
    async insertExecutedMigration(queryRunner, migration) {
        const values = {};
        if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
            values["timestamp"] = new MssqlParameter_1.MssqlParameter(migration.timestamp, this.connection.driver.normalizeType({ type: this.connection.driver.mappedDataTypes.migrationTimestamp }));
            values["name"] = new MssqlParameter_1.MssqlParameter(migration.name, this.connection.driver.normalizeType({ type: this.connection.driver.mappedDataTypes.migrationName }));
        }
        else {
            values["timestamp"] = migration.timestamp;
            values["name"] = migration.name;
        }
        if (this.connection.driver instanceof MongoDriver_1.MongoDriver) {
            const mongoRunner = queryRunner;
            await mongoRunner.databaseConnection.db(this.connection.driver.database).collection(this.migrationsTableName).insert(values);
        }
        else {
            const qb = queryRunner.manager.createQueryBuilder();
            await qb.insert()
                .into(this.migrationsTable)
                .values(values)
                .execute();
        }
    }
    /**
     * Delete previously executed migration's data from the migrations table.
     */
    async deleteExecutedMigration(queryRunner, migration) {
        const conditions = {};
        if (this.connection.driver instanceof SqlServerDriver_1.SqlServerDriver) {
            conditions["timestamp"] = new MssqlParameter_1.MssqlParameter(migration.timestamp, this.connection.driver.normalizeType({ type: this.connection.driver.mappedDataTypes.migrationTimestamp }));
            conditions["name"] = new MssqlParameter_1.MssqlParameter(migration.name, this.connection.driver.normalizeType({ type: this.connection.driver.mappedDataTypes.migrationName }));
        }
        else {
            conditions["timestamp"] = migration.timestamp;
            conditions["name"] = migration.name;
        }
        if (this.connection.driver instanceof MongoDriver_1.MongoDriver) {
            const mongoRunner = queryRunner;
            await mongoRunner.databaseConnection.db(this.connection.driver.database).collection(this.migrationsTableName).deleteOne(conditions);
        }
        else {
            const qb = queryRunner.manager.createQueryBuilder();
            await qb.delete()
                .from(this.migrationsTable)
                .where(`${qb.escape("timestamp")} = :timestamp`)
                .andWhere(`${qb.escape("name")} = :name`)
                .setParameters(conditions)
                .execute();
        }
    }
    async withQueryRunner(callback) {
        const queryRunner = this.queryRunner || this.connection.createQueryRunner("master");
        try {
            return callback(queryRunner);
        }
        finally {
            if (!this.queryRunner) {
                await queryRunner.release();
            }
        }
    }
}
exports.MigrationExecutor = MigrationExecutor;
