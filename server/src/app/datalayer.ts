import assert from 'assert';
import { ObjectID } from 'bson';
import { MongoClient } from 'mongodb';
import { ICanRaw } from './models/ICanRaw';
import { ICan } from './models/ICanData';

type InsertCallBack = (id: ObjectID) => any;

export class DataLayer {
    private conn: MongoClient;

    constructor(client: MongoClient) {
        this.conn = client;
    }

    public insertCanRaw(doc: ICanRaw, callback: InsertCallBack) {
        console.log('start insert docs');
        this.conn.db('main').collection('can_raw').insertOne(doc, (error, result) => {
            assert.equal(error, null);
            console.log('insert doc into collection can_raw');
            callback(result.insertedId);
        });
    }

    public insertCans(docs: ICan[]) {
        this.conn.db('main').collection('can').insertMany(docs, (error, result) => {
            assert.equal(error, null);
            console.log(`docs count: ${docs.length} `);
            console.log(`insert ${result.insertedCount} entries of doc into collection can`);
        });
    }

    public insertCanStates(docs: ICan[]) {
        // this.conn.db('main').collection('can_state').insertMany(docs, (error, result) => {
        //     assert.equal(error, null);
        //     console.log(`${result.insertedCount} docs were parsed and stored as can states`);
        // });
    }
}
