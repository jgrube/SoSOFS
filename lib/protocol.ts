// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: SoSOFS protocol description and helper functions
"use strict";

export const VERSION: number = 1;

// Read Request - Client sends read request to server
// Read Response - Server response to client's read request
// Write - Client sends file to server to write to disk
// Sync - Servers synchronize file system amongst each other
export const enum MESSAGE {
    READ_REQ = 0x01, // Read request
    READ_RES = 0x02, // Read response
    WRITE = 0x03,
    SYNC = 0x04
}

export const enum MAX {
    FILE_NAME = 255,  // 0xFF
    PATH_NAME = 4096, // 0x1000
    PACKET_SIZE = (10 * 1024 * 1024) // 10 MB
}

/** 
 * @param {number} version? - (1 byte) Only gets populated when parsing header. buildHeader() will populate this
 * @param {MESSAGE} msgType - See {MESSAGE} enum for possible values
 * @param {string} path - (4351 characters max) Path to file
 * @param {number} fileSize? - (3 bytes) Total size of file
*/
export interface HEADER {
    version?: number;
    msgType: MESSAGE;
    path: string;
    fileSize?: number;
}

// Header looks like:
// (UINT8)  Protocol version
// (UINT8)  Message type
// (UINT16) Length of path and file name
// (UINT8)  High message size
// (UINT16) Low message size
// (VOID)   Path/filename
// (UINT8)  Null padding byte (For all message types except READ_REQ)
// (VOID)   File data (For all message types except READ_REQ)
//
// Sample WRITE message, writing "hello" to "data/hello.txt":
// Header:       0x01 0x02 0x0E 0x00 0x00 0x05
// File path:    0x64 0x61 0x74 0x61 0x2F 0x68 0x65 0x6C 0x6C 0x6F 0x2E 0x74 0x78 0x74
// Padding byte: 0x00
// File data:    0x68 0x65 0x6C 0x6C 0x6F


export function buildHeader(headerInfo: HEADER): Buffer {
    let header: Buffer = Buffer.alloc(4);
    header.writeUInt8(VERSION, 0);
    header.writeUInt8(headerInfo.msgType, 1);
    header.writeUInt16BE(headerInfo.path.length, 2);

    // Size will be 0 for READ_REQ
    let fileSize: Buffer = Buffer.alloc(3, 0x00);
    fileSize.writeUInt8(((headerInfo.fileSize & 0xFF0000) >> 16), 0);
    fileSize.writeUInt16BE((headerInfo.fileSize & 0x00FFFF), 1);
    header = Buffer.concat([header, fileSize]);

    header = Buffer.concat([header, Buffer.from(headerInfo.path, "ascii")]);

    // null padding byte
    header = Buffer.concat([header, Buffer.from([0x00])]);

    return header;
}

export function parseHeader(header: Buffer): HEADER {
    let headerInfo: HEADER = {version: null, msgType: null, path: null, fileSize: 0};
    headerInfo.version = header.readUInt8(0);
    headerInfo.msgType = header.readInt8(1);

    let pathLength: number = header.readUInt16BE(2);
    headerInfo.path = header.slice(7, (pathLength + 7)).toString();

    if (headerInfo.msgType !== MESSAGE.READ_REQ) {
        let fileSize: number = 0;
        fileSize += (header.readUInt8(4) << 16);
        fileSize += header.readUInt16BE(5);

        headerInfo.fileSize = fileSize;
    }

    return headerInfo;
}

export function getRawHeaderFromPacket(data: Buffer): Buffer {
    if (data.length < 8) {
        return null;
    }

    // Don't put null in your filename, dingus
    let padIndex: number =  data.slice(8, data.length).indexOf(0x00);

    if (padIndex === -1) {
        return null;
    }

    return data.slice(0, (padIndex + 8)); // 8 since the slice() above stared at index 8
}
