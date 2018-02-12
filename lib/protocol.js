/**
 * SoSOFS protocol description and helper functions
 * @module protocol
 * @author John Grube <johnegrube@gmail.com>
 * @see https://github.com/jgrube/SoSOFS#readme
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    header.writeUInt16BE(headerInfo.path.length, 2);
    // Size will be 0 for READ_REQ
    let fileSize = Buffer.alloc(3, 0x00);
    fileSize.writeUInt8(((headerInfo.fileSize & 0xFF0000) >> 16), 0);
    fileSize.writeUInt16BE((headerInfo.fileSize & 0x00FFFF), 1);
    header = Buffer.concat([header, fileSize]);
    header = Buffer.concat([header, Buffer.from(headerInfo.path, "ascii")]);
    // null padding byte
    header = Buffer.concat([header, Buffer.from([0x00])]);
    return header;
}
exports.buildHeader = buildHeader;
function parseHeader(header) {
    let headerInfo = { version: null, msgType: null, path: null, fileSize: 0 };
    headerInfo.version = header.readUInt8(0);
    headerInfo.msgType = header.readInt8(1);
    let pathLength = header.readUInt16BE(2);
    headerInfo.path = header.slice(7, (pathLength + 7)).toString();
    if (headerInfo.msgType !== 1 /* READ_REQ */) {
        let fileSize = 0;
        fileSize += (header.readUInt8(4) << 16);
        fileSize += header.readUInt16BE(5);
        headerInfo.fileSize = fileSize;
    }
    return headerInfo;
}
exports.parseHeader = parseHeader;
function getRawHeaderFromPacket(data) {
    if (data.length < 8) {
        return null;
    }
    // Don't put null in your filename, dingus
    let padIndex = data.slice(8, data.length).indexOf(0x00);
    if (padIndex === -1) {
        return null;
    }
    return data.slice(0, (padIndex + 8)); // 8 since the slice() above stared at index 8
}
exports.getRawHeaderFromPacket = getRawHeaderFromPacket;
//# sourceMappingURL=protocol.js.map