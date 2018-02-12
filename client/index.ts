/**
 * SoSOFS client startup file
 * @module client/index
 * @author John Grube <johnegrube@gmail.com>
 * @see https://github.com/jgrube/SoSOFS#readme
 */

"use strict";

import path = require("path");
import client = require("./client");

let logger = require("bristol");
const config: Config = require("../config.json");

client.start(9000, (error: NodeJS.ErrnoException) => {
    if (error) {
        logger.error(error);
        throw error;
    }

    logger.info("SoSOFS client connected on port " + config.server.port);
});
