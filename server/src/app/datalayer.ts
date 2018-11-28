import assert from 'assert';
const bsplit = require('buffer-split');
// import bsplit from './types/buffer-split';
import { MongoClient } from 'mongodb';
import { ICanRaw } from './models/ICanData';

export class DataLayer {
    // private url = 'mongodb://localhost:27017';
    private url = 'mongodb://127.0.0.1:27017';
    private client: MongoClient;

    constructor() {
        this.client = new MongoClient(this.url, { useNewUrlParser: true });
    }

    public insertDocs(rawBuffer: Buffer, localPort: number, remotePort: number) {
        console.log('start insert docs');
        const rawBuffers: Buffer[] = bsplit(rawBuffer, Buffer.from('88', 'hex'));
        const buffers = (rawBuffers.filter((buf) => buf.length > 0));

        try {
            this.client.connect((err) => {
                assert.equal(null, err);
                console.log('connected to mongodb instance');
                const db = this.client.db('main');
                const collection = db.collection('can_raw');
                const docs: ICanRaw[] = [{
                    raw: rawBuffer,
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
