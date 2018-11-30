import assert from 'assert';
import { ObjectID } from 'bson';
// const bsplit = require('buffer-split');
// import bsplit from './types/buffer-split';
import { MongoClient } from 'mongodb';
import { ICanRaw } from './models/ICanRaw';
import { ICan } from './models/ICanData';

type InsertCallBack = (id: ObjectID) => any;

export class DataLayer {
    private url = 'mongodb://127.0.0.1:27017';
    private client: MongoClient;

    constructor() {
        this.client = new MongoClient(this.url, { useNewUrlParser: true });
    }

    public insertCanRaw(doc: ICanRaw, callback: InsertCallBack) {
        console.log('start insert docs');
        // const rawBuffers: Buffer[] = bsplit(rawBuffer, Buffer.from('88', 'hex'));
        // const buffers = (rawBuffers.filter((buf) => buf.length > 0));
        this.client.connect().then((conn) => {
            conn.db('main').collection('can_raw').insertOne(doc, (inerr, result) => {
                assert.equal(inerr, null);
                console.log('insert doc into collection can_raw');
                callback(result.insertedId);
            });
        });
    }

    public insertCans(docs: ICan[]) {
        this.client.connect().then((conn) => {
            conn.db('main').collection('can').insertMany(docs, (inerr, result) => {
                assert.equal(inerr, null);
                console.log('insert docs into collection can');
            });
        });
    }
}
