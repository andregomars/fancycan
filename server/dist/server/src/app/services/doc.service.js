"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bson_1 = require("bson");
var DocService = /** @class */ (function () {
    function DocService() {
    }
    DocService.prototype.buildCan = function (buffer, rawID, localPort, remotePort) {
        return {
            _id: new bson_1.ObjectID(),
            rawID: rawID,
            delimiter: buffer.slice(0, 1),
            canID: buffer.slice(1, 5),
            canData: buffer.slice(-8),
            localPort: localPort,
            remotePort: remotePort,
        };
    };
    DocService.prototype.buildCanRaw = function (buffer) {
        return {
            raw: buffer,
        };
    };
    return DocService;
}());
exports.DocService = DocService;
