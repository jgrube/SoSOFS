// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: SoSOFS server
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
let logger = require("bristol");
const config = require("../config.json");
let client;
function connectionHandler(connection) {
    logger.trace(`Server connection on ${connection.remoteAddress}:${connection.remotePort}`);
    connection.on("data", (data) => {
        logger.warn(`Server (${connection.remoteAddress}:${connection.remotePort}) data: ${data}`);
    })
        .on("close", (error) => {
        logger.trace(`Server (${connection.remoteAddress}:${connection.remotePort}) connection closed`);
    })
        .on("error", (error) => {
        logger.warn(`Server (${connection.remoteAddress}:${connection.remotePort}) error: ${error}`);
    })
        .on("timeout", () => {
        logger.warn(`Server (${connection.remoteAddress}:${connection.remotePort}) connection timeout`);
    });
}
function start(port, startCallback) {
    client = net.createConnection(port);
    client.on("connection", connectionHandler);
    setTimeout(() => { client.write("Test data"); }, 3000);
    startCallback(null);
}
exports.start = start;
//# sourceMappingURL=client.js.map