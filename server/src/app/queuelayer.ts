import { MqttClient } from 'mqtt';
import { Utility } from './services/utility';
import { ICan } from './models';

export class QueueLayer {
    private queue: MqttClient;
    private utility: Utility;

    constructor(client: MqttClient) {
        this.queue = client;
        this.utility = new Utility();
    }

    public publishCan(doc: ICan) {
        if (doc) {
            const topic = this.utility.getTopicName();
            const message = JSON.stringify(doc);
            this.queue.publish(topic, message);
        }
    }

}
