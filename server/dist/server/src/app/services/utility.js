"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var cache_1 = __importDefault(require("@fancycan/cache"));
var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.prototype.getDbConnectionString = function () {
        var host = encodeURIComponent(config_1.default.get('dbConfig.host'));
        var port = encodeURIComponent(config_1.default.get('dbConfig.port'));
        var user = encodeURIComponent(config_1.default.get('dbConfig.user'));
        var password = encodeURIComponent(config_1.default.get('dbConfig.password'));
        var authMechanism = config_1.default.get('dbConfig.auth');
        // e.g. 'mongodb://127.0.0.1:27017';
        var url = "mongodb://" + user + ":" + password + "@" + host + ":" + port + "/?authMechanism=" + authMechanism;
        return url;
    };
    Utility.prototype.getMqConnectionString = function () {
        var host = encodeURIComponent(config_1.default.get('mqConfig.host'));
        var scheme = encodeURIComponent(config_1.default.get('mqConfig.scheme'));
        var port = encodeURIComponent(config_1.default.get('mqConfig.port'));
        // e.g. 'mqtt://127.0.0.1:1833', 'ws://127.0.0.1:9001'
        var url = scheme + "://" + host + ":" + port;
        return url;
    };
    Utility.prototype.getCommonConfig = function (key) {
        return config_1.default.get("common." + key);
    };
    Utility.prototype.getFbConnectionString = function () {
        return config_1.default.get('fbConfig.url');
    };
    Utility.prototype.getTopicName = function (name) {
        if (name === void 0) { name = 'default'; }
        var defaultTopic = 'tCan';
        return config_1.default.get("mqConfig.topics." + name) || defaultTopic;
    };
    Utility.prototype.storeSpnsIntoCacheGroupedByPgn = function (spns) {
        var cache = cache_1.default.getInstance();
        var key = '';
        for (var _i = 0, spns_1 = spns; _i < spns_1.length; _i++) {
            var spn = spns_1[_i];
            key = this.buildPgnKey(spn.PGNNo);
            var pgn = cache.get(key);
            if (pgn && pgn.length > 0) {
                pgn.push(spn);
                cache.set(key, pgn);
            }
            else {
                cache.set(key, [spn]);
            }
        }
    };
    Utility.prototype.retrieveSpnsByPgnFromCache = function (pgnNo) {
        var key = this.buildPgnKey(pgnNo);
        return cache_1.default.getInstance().get(key);
    };
    // public async saveCanDocs(docs: ICan[], dbo: DataLayer, transformService: TransformService) {
    //     dbo.insertCans(docs);
    //     const states = transformService.getCanStates(docs);
    //     await dbo.insertCanStates(states);
    //     for (const canState of states) {
    //         await this.saveVehicleStateDoc(canState, dbo, transformService);
    //     }
    // }
    Utility.prototype.saveCanDoc = function (doc, dbo, transformService) {
        return __awaiter(this, void 0, void 0, function () {
            var states, _i, states_1, canState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dbo.insertCan(doc)];
                    case 1:
                        _a.sent();
                        states = transformService.getCanState(doc);
                        if (!(states.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, dbo.insertCanStates(states)];
                    case 2:
                        _a.sent();
                        _i = 0, states_1 = states;
                        _a.label = 3;
                    case 3:
                        if (!(_i < states_1.length)) return [3 /*break*/, 7];
                        canState = states_1[_i];
                        return [4 /*yield*/, this.saveVehicleStateDoc(canState, dbo, transformService)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.saveVehicleMalfuncStateDoc(canState, dbo, transformService)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Utility.prototype.saveVehicleStateDoc = function (canState, dbo, transofrmService) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = transofrmService.buildVehicleState(canState);
                        return [4 /*yield*/, dbo.upsertVehicleState(state)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Utility.prototype.saveVehicleMalfuncStateDoc = function (canState, dbo, transofrmService) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(canState.spnNo === 190 && canState.value > 800)) return [3 /*break*/, 2];
                        state = transofrmService.buildVehicleMalfuncState(canState);
                        return [4 /*yield*/, dbo.insertVehicleMalfuncState(state)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Utility.prototype.buildRuleConditionGroups = function (malfuncRules) {
        var _this = this;
        var conditionGroups = new Map();
        for (var _i = 0, malfuncRules_1 = malfuncRules; _i < malfuncRules_1.length; _i++) {
            var rule = malfuncRules_1[_i];
            var conditions = rule.conditions.map(function (condition) {
                return {
                    fact: "spn" + condition.spn,
                    operator: _this.getOperatorTerm(condition.expression),
                    value: condition.value,
                };
            });
            if (conditions.length > 0) {
                var conditionFleetCode = {
                    fact: 'fcode',
                    operator: 'equal',
                    value: rule.fleet_code,
                };
                conditions.push(conditionFleetCode);
            }
            conditionGroups.set(rule.id, conditions);
        }
        return conditionGroups;
    };
    Utility.prototype.buildPgnKey = function (pgnNo) {
        return "pgn_" + pgnNo;
    };
    Utility.prototype.getOperatorTerm = function (sign) {
        var term = '';
        switch (sign) {
            case '>':
                term = 'greaterThan';
                break;
            case '<':
                term = 'lessThan';
                break;
            case '=':
                term = 'equal';
                break;
            case '!=':
                term = 'notEqual';
                break;
            default:
                break;
        }
        return term;
    };
    return Utility;
}());
exports.Utility = Utility;
