// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: SoSOFS server
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const fs = require("fs-extra");
let logger = require("bristol");
const config = require("../config.json");
let server = net.createServer();
server.on("connection", connectionHandler);
function parseRxData(data) {
    logger.trace(`ParseRX: ${data}`);
    fs.outputFile("./data/test_file.txt", data);
}
function connectionHandler(connection) {
    logger.trace(`Client connection from ${connection.remoteAddress}:${connection.remotePort}`);
    let incomingData = Buffer.alloc(0);
    connection.on("data", (data) => {
        logger.trace(`Client (${connection.remoteAddress}:${connection.remotePort}) data: ${data}`);
        incomingData = Buffer.concat([incomingData, data]);
    })
        .on("close", (error) => {
        logger.trace(`Client (${connection.remoteAddress}:${connection.remotePort}) connection closed`);
        setTimeout(parseRxData, 0, incomingData);
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