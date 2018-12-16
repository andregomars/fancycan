import assert from 'assert';
import { ObjectID } from 'bson';
import { MongoClient } from 'mongodb';
import { ICanRaw } from './models/ICanRaw';
import { ICan } from './models/ICanData';

type InsertCallBack = (id: ObjectID) => any;

export class DataLayer {
    // private url = 'mongodb://127.0.0.1:27017';
    private conn: MongoClient;

    constructor(client: MongoClient) {
        // this.client = new MongoClient(this.url, { useNewUrlParser: true });
        this.conn = client;
    }

    public insertCanRaw(doc: ICanRaw, callback: InsertCallBack) {
        console.log('start insert docs');
        // const rawBuffers: Buffer[] = bsplit(rawBuffer, Buffer.from('88', 'hex'));
        // const buffers = (rawBuffers.filter((buf) => buf.length > 0));
        this.conn.db('main').collection('can_raw').insertOne(doc, (error, result) => {
            assert.equal(error, null);
            console.log('insert doc into collection can_raw');
            callback(result.insertedId);
        });
    }

    public insertCans(docs: ICan[]) {
        this.conn.db('main').collection('can').insertMany(docs, (error, result) => {
            assert.equal(error, null);
            console.log(`insert ${result.insertedCount} entries of doc into collection can`);
        });
    }
}
