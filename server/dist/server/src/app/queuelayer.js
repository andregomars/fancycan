"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mqtt = __importStar(require("mqtt"));
var QueueLayer = /** @class */ (function () {
    function QueueLayer(brokerUrl) {
        this.queue = mqtt.connect(brokerUrl);
    }
    QueueLayer.prototype.publish = function (message, topic) {
        if (message) {
            var msgText = JSON.stringify(message);
            this.queue.publish(topic, msgText);
        }
    };
    return QueueLayer;
}());
exports.QueueLayer = QueueLayer;
