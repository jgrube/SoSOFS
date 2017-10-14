// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: Client startup file
"use strict";
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