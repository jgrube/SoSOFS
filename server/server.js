// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: SoSOFS server
"use strict";
const net = require("net");
let logger = require("bristol");
const config = require("../config.json");
let server = net.createServer();
server.on("connection", connectionHandler);
function connectionHandler(connection) {
    logger.trace(`Client connection from ${connection.remoteAddress}:${connection.remotePort}`);
    connection.on("data", (data) => {
        logger.trace(`Client (${connection.remoteAddress}:${connection.remotePort}) data: ${data}`);
    })
        .on("close", (error) => {
        logger.trace(`Client (${connection.remoteAddress}:${connection.remotePort}) connection closed`);
    })
        .on("error", (error) => {
        logger.warn(`Client (${connection.remoteAddress}:${connection.remotePort}) error: ${error}`);
    })
        .on("timeout", () => {
        logger.warn(`Client (${connection.remoteAddress}:${connection.remotePort}) connection timeout`);
    });
}
function start(port, startCallback) {
    server.listen(port);
    startCallback(null);
}
exports.start = start;
//# sourceMappingURL=server.js.map