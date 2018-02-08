// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: SoSOFS server
"use strict";

import net = require("net");
import fs = require("fs-extra");

let logger = require("bristol");
const config: Config = require("../config.json");

let server = net.createServer();
server.on("connection", connectionHandler);

function parseRxData(data: Buffer) {
    logger.trace(`ParseRX: ${data}`);
    fs.outputFile("./data/test_file.txt", data);
}

function connectionHandler(connection: net.Socket): void {
    logger.trace(`Client connection from ${connection.remoteAddress}:${connection.remotePort}`);

    let incomingData: Buffer = Buffer.alloc(0);

    connection.on("data", (data: Buffer) => {
        logger.trace(`Client (${connection.remoteAddress}:${connection.remotePort}) data: ${data}`);
        incomingData = Buffer.concat([incomingData, data]);
    })
    .on("close", (error: boolean) => {
        logger.trace(`Client (${connection.remoteAddress}:${connection.remotePort}) connection closed`);
        setImmediate(parseRxData, incomingData);
    })
    .on("error", (error: NodeJS.ErrnoException) => {
        logger.warn(`Client (${connection.remoteAddress}:${connection.remotePort}) error: ${error}`);
    })
    .on("timeout", () => {
        logger.warn(`Client (${connection.remoteAddress}:${connection.remotePort}) connection timeout`);
    });
}

export function start(port: number, startCallback: (error: NodeJS.ErrnoException) => void): void {
    server.listen(port);
    startCallback(null);
}
