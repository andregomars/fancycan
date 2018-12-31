import assert from 'assert';
import { ObjectID } from 'bson';
import { MongoClient } from 'mongodb';
import { ICanRaw } from './models/ICanRaw';
import { ICan } from './models/ICanData';
import { ICanState } from './models/ICanState';

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
        if (!docs || docs.length < 1) {
            return;
        }
        this.conn.db('main').collection('can').insertMany(docs, (error, result) => {
            assert.equal(error, null);
            console.log(`${result.insertedCount} docs were stored into can collection`);
        });
    }

    public insertCanStates(docs: ICanState[]) {
        if (!docs || docs.length < 1) {
            return;
        }
        this.conn.db('main').collection('can_state').insertMany(docs, (error, result) => {
            assert.equal(error, null);
            console.log(`${result.insertedCount} docs were stored into can_states`);
        });
    }
}
