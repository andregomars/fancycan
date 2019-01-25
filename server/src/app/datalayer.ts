import assert from 'assert';
import { ObjectID } from 'bson';
import { MongoClient } from 'mongodb';
import { ICanRaw } from './models';
import { ICan } from './models';
import { ICanState } from './models';

export class DataLayer {
    private conn: MongoClient;

    constructor(client: MongoClient) {
        this.conn = client;
    }

    // public insertCanRaw(doc: ICanRaw, callback: InsertCallBack) {
    //     console.log('start insert docs');
    //     this.conn.db('main').collection('can_raw').insertOne(doc, (error, result) => {
    //         assert.equal(error, null);
    //         console.log('insert doc into collection can_raw');
    //         callback(result.insertedId);
    //     });
    // }

    // public async insertCans(docs: ICan[]) {
    //     await this.conn.db('main').collection('can').insertMany(docs, { forceServerObjectId: true });
    // }

    public async insertCanRaw(doc: ICanRaw): Promise<ObjectID> {
        const result = await this.conn.db('main').collection('can_raw').insertOne(doc);
        return result.insertedId;
    }

    public async insertCan(doc: ICan) {
        await this.conn.db('main').collection('can').insertOne(doc);
    }

    public async insertCanStates(docs: ICanState[]) {
        await this.conn.db('main').collection('can_state').insertMany(docs, { forceServerObjectId: true });
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

    public async insertVehicleMalfuncState(state: any) {
        await this.conn.db('main').collection('vehicle_malfunc_state').insertOne(state);
    }
}
