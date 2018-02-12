/**
 * SoSOFS client module
 * @module client
 * @author John Grube <johnegrube@gmail.com>
 * @see https://github.com/jgrube/SoSOFS#readme
 */

"use strict";

import net = require("net");

let logger = require("bristol");
const config: Config = require("../config.json");

let client: net.Socket;

function connectionHandler(connection: net.Socket): void {
    logger.trace(`Server connection on ${connection.remoteAddress}:${connection.remotePort}`);

    connection.on("data", (data: Buffer) => {
        logger.warn(`Server (${connection.remoteAddress}:${connection.remotePort}) data: ${data}`);
    })
    .on("close", (error: boolean) => {
        logger.trace(`Server (${connection.remoteAddress}:${connection.remotePort}) connection closed`);
    })
    .on("error", (error: NodeJS.ErrnoException) => {
        logger.warn(`Server (${connection.remoteAddress}:${connection.remotePort}) error: ${error}`);
    })
    .on("timeout", () => {
        logger.warn(`Server (${connection.remoteAddress}:${connection.remotePort}) connection timeout`);
    });
}

export function start(port: number, startCallback: (error: NodeJS.ErrnoException) => void): void {
    client = net.createConnection(port);
    client.on("connection", connectionHandler);
    setTimeout(() => { client.write("Test data"); }, 3000);
    startCallback(null);
}