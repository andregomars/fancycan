"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var utility_1 = require("./utility");
var TransformService = /** @class */ (function () {
    function TransformService() {
        this.utility = new utility_1.Utility();
    }
    TransformService.prototype.getCanStates = function (cans) {
        var _this = this;
        return cans.map(function (can) { return _this.getCanState(can); }).reduce(function (pre, cur) { return pre.concat(cur); });
    };
    TransformService.prototype.getCanState = function (can) {
        var pgnID = this.decodePGN(can.canID);
        var spns = this.utility.retrieveSpnsByPgnFromCache(pgnID);
        if (!spns) {
            return [];
        }
        var canStates = new Array();
        for (var _i = 0, _a = spns; _i < _a.length; _i++) {
            var spn = _a[_i];
            var val = this.decodeData(can.canData, spn);
            var vcode = lodash_1.default.random(6001, 6010).toString();
            var state = {
                canObjID: can._id,
                // canObjID: can.rawID,
                vcode: vcode,
                spnNo: spn.SPNNo,
                spnName: spn.SPNName,
                pgnNo: pgnID,
                pgnName: spn.PGNName,
                value: val,
                unit: spn.Unit,
                min: spn.LowerDataRange,
                max: spn.UpperDataRange,
            };
            canStates.push(state);
        }
        return canStates;
    };
    TransformService.prototype.decodePGN = function (canID) {
        return canID.readUInt16BE(1);
    };
    TransformService.prototype.decodeData = function (raw, definition) {
        var bytesCount = Math.ceil((definition.Length + definition.StartBit - 1) / 8);
        var bytes = raw.slice(definition.StartByte - 1, definition.StartByte - 1 + bytesCount);
        var parsedValues = [];
        var firstIdx = bytes.length - 1;
        var lastIdx = 0;
        for (var i = 0; i < bytes.length; i++) {
            var value = 0;
            if (i === firstIdx) { // the first byte
                var firstByte = bytes[firstIdx];
                // tslint:disable-next-line:no-bitwise
                value = firstByte >> (definition.StartBit - 1) & (Math.pow(2, definition.Length) - 1);
            }
            else if (i === lastIdx) { // the last byte
                var lastByte = bytes[lastIdx];
                var shift = (definition.StartBit + definition.Length - 1) % 8;
                // tslint:disable-next-line:no-bitwise
                value = lastByte & (Math.pow(2, (shift === 0 ? 8 : shift)) - 1);
            }
            else {
                value = bytes[i];
            }
            parsedValues.push(value);
        }
        var val = Buffer.from(parsedValues).readUIntLE(0, bytesCount);
        return lodash_1.default.round(val * definition.Resolution + definition.Offset, 4);
    };
    TransformService.prototype.buildVehicleState = function (canState) {
        var fcode = 'BYD';
        var geolocations = [
            { lat: 34.057539, long: -118.237494 },
            { lat: 34.056544, long: -118.238082 },
            { lat: 34.055955, long: -118.238996 },
            { lat: 34.056325, long: -118.239507 },
        ];
        var state = {
            vcode: canState.vcode,
            fcode: fcode,
            geo: geolocations,
        };
        state['spn' + canState.spnNo] = canState.value;
        return state;
    };
    TransformService.prototype.buildVehicleMalfuncState = function (canState) {
        var fcode = 'BYD';
        var state = {
            vcode: canState.vcode,
            fcode: fcode,
            spn: canState.spnNo,
            value: canState.value,
            type: 'General',
            CreatedDate: canState.canObjID.getTimestamp(),
        };
        return state;
    };
    return TransformService;
}());
exports.TransformService = TransformService;
