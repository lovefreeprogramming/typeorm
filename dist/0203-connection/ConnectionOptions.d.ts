import { CockroachConnectionOptions } from "../0201-driver/cockroachdb/CockroachConnectionOptions";
import { MysqlConnectionOptions } from "../0201-driver/mysql/MysqlConnectionOptions";
import { PostgresConnectionOptions } from "../0201-driver/postgres/PostgresConnectionOptions";
import { SqliteConnectionOptions } from "../0201-driver/sqlite/SqliteConnectionOptions";
import { SqlServerConnectionOptions } from "../0201-driver/sqlserver/SqlServerConnectionOptions";
import { OracleConnectionOptions } from "../0201-driver/oracle/OracleConnectionOptions";
import { MongoConnectionOptions } from "../0201-driver/mongodb/MongoConnectionOptions";
import { CordovaConnectionOptions } from "../0201-driver/cordova/CordovaConnectionOptions";
import { SqljsConnectionOptions } from "../0201-driver/sqljs/SqljsConnectionOptions";
import { ReactNativeConnectionOptions } from "../0201-driver/react-native/ReactNativeConnectionOptions";
import { NativescriptConnectionOptions } from "../0201-driver/nativescript/NativescriptConnectionOptions";
import { ExpoConnectionOptions } from "../0201-driver/expo/ExpoConnectionOptions";
import { AuroraDataApiConnectionOptions } from "../0201-driver/aurora-data-api/AuroraDataApiConnectionOptions";
import { SapConnectionOptions } from "../0201-driver/sap/SapConnectionOptions";
/**
 * ConnectionOptions is an interface with settings and options for specific connection.
 * Options contain database and other connection-related settings.
 * Consumer must provide connection options for each of your connections.
 */
export declare type ConnectionOptions = MysqlConnectionOptions | PostgresConnectionOptions | CockroachConnectionOptions | SqliteConnectionOptions | SqlServerConnectionOptions | SapConnectionOptions | OracleConnectionOptions | CordovaConnectionOptions | NativescriptConnectionOptions | ReactNativeConnectionOptions | SqljsConnectionOptions | MongoConnectionOptions | AuroraDataApiConnectionOptions | ExpoConnectionOptions;
