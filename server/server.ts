// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: SoSOFS server
"use strict";

import net = require("net");

let logger = require("bristol");
const config: Config = require("../config.json");

let server = net.createServer();
server.on("connection", connectionHandler);

function connectionHandler(connection: net.Socket): void {
    logger.trace(`Client connection from ${connection.remoteAddress}:${connection.remotePort}`);

    connection.on("data", (data: Buffer) => {
        logger.trace(`Client (${connection.remoteAddress}:${connection.remotePort}) data: ${data}`);
    })
    .on("close", (error: boolean) => {
        logger.trace(`Client (${connection.remoteAddress}:${connection.remotePort}) connection closed`);
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