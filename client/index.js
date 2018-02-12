/**
 * SoSOFS client startup file
 * @module client/index
 * @author John Grube <johnegrube@gmail.com>
 * @see https://github.com/jgrube/SoSOFS#readme
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client = require("./client");
let logger = require("bristol");
const config = require("../config.json");
client.start(9000, (error) => {
    if (error) {
        logger.error(error);
        throw error;
    }
    logger.info("SoSOFS client connected on port " + config.server.port);
});
//# sourceMappingURL=index.js.map