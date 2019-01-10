import assert from 'assert';
import { ObjectID } from 'bson';
import { MongoClient } from 'mongodb';
import { ICanRaw } from './models/ICanRaw';
import { ICan } from './models/ICanData';
import { ICanState } from './models/ICanState';
import { IVehicleState } from '../../../library/src';

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

    public insertCan(doc: ICan) {
        this.conn.db('main').collection('can').insertOne(doc, (error, result) => {
            assert.equal(error, null);
        });
    }

    public insertCans(docs: ICan[]) {
        if (!docs || docs.length < 1) {
            return;
        }

        this.conn.db('main').collection('can').insertMany(docs, { forceServerObjectId: true }, (error, result) => {
            assert.equal(error, null);
        });
    }

    public async insertCanStates(docs: ICanState[]) {
        try {
            await this.conn.db('main').collection('can_state').insertMany(docs, { forceServerObjectId: true });
        } catch (error) {
            console.log(error);
        }
    }

    public async upsertVehicleState(state: any) {
        await this.conn.db('main').collection('vehicle_state').updateOne(
            { vcode: state.vcode },
            {
                $currentDate: { editDate: true },
                $set: state,
                $setOnInsert: { createDate: new Date() },
            },
            { upsert: true },
        );
    }
}
