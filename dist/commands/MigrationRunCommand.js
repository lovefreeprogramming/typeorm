"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationRunCommand = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../index");
const ConnectionOptionsReader_1 = require("../0203-connection/ConnectionOptionsReader");
const process = tslib_1.__importStar(require("process"));
const chalk = require("chalk");
/**
 * Runs migration command.
 */
class MigrationRunCommand {
    constructor() {
        this.command = "migration:run";
        this.describe = "Runs all pending migrations.";
        this.aliases = "migrations:run";
    }
    builder(args) {
        return args
            .option("connection", {
            alias: "c",
            default: "default",
            describe: "Name of the connection on which run a query."
        })
            .option("transaction", {
            alias: "t",
            default: "default",
            describe: "Indicates if transaction should be used or not for migration run. Enabled by default."
        })
            .option("config", {
            alias: "f",
            default: "ormconfig",
            describe: "Name of the file with connection configuration."
        });
    }
    async handler(args) {
        if (args._[0] === "migrations:run") {
            console.log("'migrations:run' is deprecated, please use 'migration:run' instead");
        }
        let connection = undefined;
        try {
            const connectionOptionsReader = new ConnectionOptionsReader_1.ConnectionOptionsReader({
                root: process.cwd(),
                configName: args.config
            });
            const connectionOptions = await connectionOptionsReader.get(args.connection);
            Object.assign(connectionOptions, {
                subscribers: [],
                synchronize: false,
                migrationsRun: false,
                dropSchema: false,
                logging: ["query", "error", "schema"]
            });
            connection = await index_1.createConnection(connectionOptions);
            const options = {
                transaction: "all",
            };
            switch (args.t) {
                case "all":
                    options.transaction = "all";
                    break;
                case "none":
                case "false":
                    options.transaction = "none";
                    break;
                case "each":
                    options.transaction = "each";
                    break;
                default:
                // noop
            }
            await connection.runMigrations(options);
            await connection.close();
            // exit process if no errors
            process.exit(0);
        }
        catch (err) {
            if (connection)
                await connection.close();
            console.log(chalk.black.bgRed("Error during migration run:"));
            console.error(err);
            process.exit(1);
        }
    }
}
exports.MigrationRunCommand = MigrationRunCommand;
