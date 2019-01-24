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
var net_1 = __importDefault(require("net"));
var exit_hook_1 = __importDefault(require("exit-hook"));
var stream_1 = require("stream");
var mongodb_1 = require("mongodb");
var queuelayer_1 = require("./queuelayer");
var chunker = require('stream-chunker');
var datalayer_1 = require("./datalayer");
var doc_service_1 = require("./services/doc.service");
var transform_services_1 = require("./services/transform.services");
var utility_1 = require("./services/utility");
var firelayer_1 = require("./firelayer");
var Application = /** @class */ (function () {
    function Application() {
    }
    Application.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fire, utility, spns, stream, tcpServer, docService, MAX_BUFFERS, port, urlDbConn, urlMqConn, mqTopic, mqo, dbClient, dbo, transformService;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fire = new firelayer_1.FireLayer();
                        utility = new utility_1.Utility();
                        return [4 /*yield*/, fire.getDefinitionWithSpecs().toPromise()];
                    case 1:
                        spns = _a.sent();
                        utility.storeSpnsIntoCacheGroupedByPgn(spns);
                        stream = this.createReadStream();
                        tcpServer = net_1.default.createServer();
                        docService = new doc_service_1.DocService();
                        MAX_BUFFERS = +utility.getCommonConfig('rawParsingBuffer');
                        port = +utility.getCommonConfig('listeningPort');
                        urlDbConn = utility.getDbConnectionString();
                        urlMqConn = utility.getMqConnectionString();
                        mqTopic = utility.getTopicName();
                        mqo = new queuelayer_1.QueueLayer(urlMqConn);
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(urlDbConn, { useNewUrlParser: true })];
                    case 2:
                        dbClient = _a.sent();
                        dbo = new datalayer_1.DataLayer(dbClient);
                        transformService = new transform_services_1.TransformService();
                        tcpServer.on('connection', function (socket) {
                            try {
                                var remotePort_1 = socket.remotePort;
                                var localPort_1 = socket.localPort;
                                var rawID_1;
                                stream.pipe(chunker(13))
                                    .on('data', function (chunk) {
                                    var doc = docService.buildCan(chunk, rawID_1, localPort_1, remotePort_1);
                                    (function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, utility.saveCanDoc(doc, dbo, transformService)];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })();
                                    mqo.publish(doc, mqTopic);
                                });
                                // push into splitter stream while fetching data from TCP socket
                                socket.on('data', function (data) {
                                    var doc = docService.buildCanRaw(data);
                                    (function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, dbo.insertCanRaw(doc)];
                                                case 1:
                                                    rawID_1 = _a.sent();
                                                    stream.push(data);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })();
                                    // dbo.insertCanRaw(doc, (id: ObjectID) => {
                                    //     rawID = id;
                                    //     stream.push(data);
                                    // });
                                });
                            }
                            catch (error) {
                                console.log(error);
                            }
                        });
                        tcpServer.listen(port);
                        console.log('start listening on port ' + port);
                        exit_hook_1.default(function () {
                            tcpServer.close();
                            dbClient.close();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Application.prototype.createReadStream = function () {
        return new stream_1.Readable({
            read: function () {
                return;
            },
        });
    };
    return Application;
}());
exports.Application = Application;
