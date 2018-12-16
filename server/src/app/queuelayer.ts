import { MqttClient } from 'mqtt';
import { Utility } from './services/utility';
import { ICan } from './models/ICanData';

export class QueueLayer {
    private queue: MqttClient;
    private utility: Utility;

    constructor(client: MqttClient) {
        this.queue = client;
        this.utility = new Utility();
    }

    public publishCans(docs: ICan[]) {
        const topic = this.utility.getTopicName();
        const message = JSON.stringify(docs);
        this.queue.publish(topic, message);
    }

}
