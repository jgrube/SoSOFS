/**
 * SoSOFS server startup file
 * @module server/index
 * @author John Grube <johnegrube@gmail.com>
 * @see https://github.com/jgrube/SoSOFS#readme
 */

"use strict";

import path = require("path");
import server = require("./server");

let logger = require("bristol");
const config: Config = require("../config.json");

if (!config.server) {
    throw new Error("config: server config required");
}

if (config.common.logTarget === "file") {
    logger.addTarget("file", {file: path.join(config.common.dataRoot, "logs/server.log")})
          .withFormatter("human")
          .withLowestSeverity(config.server.verbosity || "trace");
}
else {
    logger.addTarget(config.common.logTarget)
          .withFormatter("human")
          .withLowestSeverity(config.server.verbosity || "trace");
}

server.start(config.server.port || 9000, (error: NodeJS.ErrnoException) => {
    if (error) {
        logger.error(error);
        throw error;
    }

    logger.info("SoSOFS server listening on " + config.server.port);
});
