import * as mqtt from 'mqtt';

export class QueueLayer {
    private queue: mqtt.Client;

    constructor(brokerUrl: string) {
        this.queue = mqtt.connect(brokerUrl);
    }

    public publish<T>(message: T, topic: string) {
        if (message) {
            const msgText = JSON.stringify(message);
            this.queue.publish(topic, msgText);
        }
    }
}
