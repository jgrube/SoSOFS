// Copyright (c) 2017 John Grube johnegrube@gmail.com
// Description: SoSOFS protocol description and helper functions
"use strict";
exports.VERSION = 1;
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
function buildHeader(headerInfo) {
    let header = Buffer.alloc(4);
    header.writeUInt8(exports.VERSION, 0);
    header.writeUInt8(headerInfo.msgType, 1);
    header.writeUInt16BE(headerInfo.pathLength, 2);
    if (headerInfo.msgType !== 1 /* READ_REQ */ && headerInfo.fileSize !== undefined) {
        let fileSize = Buffer.alloc(3);
        fileSize.writeUInt8(((headerInfo.fileSize & 0xFF0000) >> 16), 0);
        fileSize.writeUInt16BE((headerInfo.fileSize & 0x00FFFF), 1);
        header = Buffer.concat([header, fileSize]);
    }
    return header;
}
exports.buildHeader = buildHeader;
function parseHeader(header) {
    let headerInfo = { version: null, msgType: null, pathLength: 0, fileSize: 0 };
    headerInfo.version = header.readUInt8(0);
    headerInfo.msgType = header.readInt8(1);
    headerInfo.pathLength = header.readUInt16BE(2);
    if (headerInfo.msgType !== 1 /* READ_REQ */) {
        let fileSize = 0;
        fileSize += (header.readUInt8(4) << 16);
        fileSize += header.readUInt16BE(5);
        headerInfo.fileSize = fileSize;
    }
    return headerInfo;
}
exports.parseHeader = parseHeader;
//# sourceMappingURL=protocol.js.map