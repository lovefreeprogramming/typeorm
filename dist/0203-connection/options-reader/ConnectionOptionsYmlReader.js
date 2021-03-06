"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionOptionsYmlReader = void 0;
const PlatformTools_1 = require("../../platform/PlatformTools");
/**
 * Reads connection options defined in the yml file.
 */
class ConnectionOptionsYmlReader {
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Reads connection options from given yml file.
     */
    read(path) {
        const ymlParser = PlatformTools_1.PlatformTools.load("js-yaml");
        const config = ymlParser.safeLoad(PlatformTools_1.PlatformTools.readFileSync(path));
        return Object.keys(config).map(connectionName => {
            return Object.assign({ name: connectionName }, config[connectionName]);
        });
    }
}
exports.ConnectionOptionsYmlReader = ConnectionOptionsYmlReader;
