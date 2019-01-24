"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxios_1 = require("rxios");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var utility_1 = require("./services/utility");
var FireLayer = /** @class */ (function () {
    function FireLayer() {
        var rootUrl = new utility_1.Utility().getFbConnectionString();
        this.http = new rxios_1.Rxios({
            baseURL: rootUrl,
        });
    }
    FireLayer.prototype.getDefinitions = function () {
        return this.http
            .get("/definitions.json");
    };
    FireLayer.prototype.getProprietarySpnList = function () {
        return this.http
            .get("/proprietary-spn.json");
    };
    FireLayer.prototype.getJ1939SpnList = function () {
        return this.http
            .get("/j1939spn.json");
    };
    FireLayer.prototype.getDefinitionWithSpecs = function () {
        var _this = this;
        return rxjs_1.forkJoin(this.getDefinitions(), this.getProprietarySpnList(), this.getJ1939SpnList()).pipe(operators_1.map(function (_a) {
            var defs = _a[0], spnsProp = _a[1], spns1939 = _a[2];
            spns1939 = _this.getFlattedSPNSpecs(spns1939);
            var spnGroups = defs.map(function (def) {
                var spnsPropMatched = spnsProp.filter(function (spn) {
                    return def.type === 'Proprietary' && def.spn === spn.SPNNo && def.pgn === spn.PGNNo;
                });
                var spns1939Matched = spns1939.filter(function (spn) {
                    return def.type === 'J1939' && def.spn === spn.SPNNo && def.pgn === spn.PGNNo;
                });
                var spns = spnsPropMatched.concat(spns1939Matched);
                return spns.map(function (spn) {
                    return {
                        Code: def.code,
                        SPNNo: +spn.SPNNo,
                        SPNName: spn.SPNName,
                        PGNNo: +spn.PGNNo,
                        PGNName: spn.PGNName,
                        StartByte: +spn.StartByte,
                        StartBit: +spn.StartBit,
                        Length: +spn.Length,
                        Resolution: +spn.Resolution,
                        Offset: +spn.Offset,
                        Unit: spn.Unit,
                        LowerDataRange: +spn.LowerDataRange,
                        UpperDataRange: +spn.UpperDataRange,
                        Status: spn.Status,
                    };
                });
            }).filter(function (x) { return x.length > 0; }); // remove def entry that cannot be found either in Proprietary or J1939 specs
            // deconstruct nested arrays
            return spnGroups.reduce(function (pre, cur) { return pre.concat(cur); });
        }));
    };
    FireLayer.prototype.getMalfunctionSetting = function () {
        return this.http
            .get("/malfunction-setting.json");
    };
    FireLayer.prototype.getFlattedSPNSpecs = function (specs) {
        return specs.map(function (pgn) {
            return pgn.SPNItems.map(function (spn) {
                return Object.assign({}, spn, { TransmissionRate: pgn.TransmissionRate }, { PGNNo: pgn.PGNNo }, { PGNName: pgn.PGNName }, { SA: pgn.SA }, { DA: pgn.DA }, { Priority: pgn.Priority });
            });
        }).reduce(function (acc, cur) { return acc.concat(cur); }, []);
    };
    return FireLayer;
}());
exports.FireLayer = FireLayer;
