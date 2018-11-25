import assert from 'assert';
import { MongoClient } from 'mongodb';
import { ICanData } from './models/ICanData';

export class DataLayer {
    // private url = 'mongodb://localhost:27017';
    private url = 'mongodb://127.0.0.1:27017';
    private client: MongoClient;

    constructor() {
        this.client = new MongoClient(this.url, { useNewUrlParser: true });
    }

    public insertDocs(buffer: Buffer, localPort: number, remotePort: number) {
        console.log('start insert docs');
        try {
            this.client.connect((err) => {
                assert.equal(null, err);
                console.log('connected to mongodb instance');
                const db = this.client.db('main');
                const collection = db.collection('can');
                const docs: ICanData[] = [{
                    raw: buffer,
                    localPort: localPort,
                    remotePort: remotePort,
                    time: new Date(),
                }];
                collection.insertMany(docs, (inerr, result) => {
                    assert.equal(inerr, null);
                    console.log('insert docs into collection can');
                });
            });
        } catch (error) {
            if (this.client && this.client.isConnected) {
                this.client.close();
            }
            console.log(error);
        }
    }
}
