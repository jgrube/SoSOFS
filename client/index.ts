// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: Client startup file
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
