import { Buffer } from 'buffer/';
import { MongoClient, ObjectID } from 'mongodb';
import { ICan, ICanState, ICanRaw } from 'fancycan-model';
import { MongoLayer } from '../core';
import { TransformUtility } from 'fancycan-utility';
import { SpnCache } from '../cache';

const DB_MAIN = 'main';
const COLL_CAN = 'can';
const COLL_CAN_RAW = 'can_raw';
const COLL_CAN_STATE = 'can_state';

export class CanRepository {
    private conn: MongoClient;
    private transform: TransformUtility;
    private spnCache: SpnCache;

    public constructor() {
        this.conn = MongoLayer.getInstance().Client;
        this.transform = new TransformUtility();
        this.spnCache = new SpnCache();
    }

    public async insertCanRaw(doc: ICanRaw): Promise<ObjectID> {
        const result = await this.conn.db(DB_MAIN).collection(COLL_CAN_RAW).insertOne(doc);
        return result.insertedId;
    }

    public async insertCan(doc: ICan) {
        await this.conn.db(DB_MAIN).collection(COLL_CAN).insertOne(doc);
    }

    public async insertCanStates(docs: ICanState[]) {
        await this.conn.db(DB_MAIN).collection(COLL_CAN_STATE).insertMany(docs, { forceServerObjectId: true });
    }

    public buildCan(buffer: Buffer, rawID: ObjectID, localPort: number, remotePort: number): ICan {
        return {
            _id: new ObjectID(),
            rawID: rawID,
            delimiter: buffer.slice(0, 1),
            canID: buffer.slice(1, 5),
            canData: buffer.slice(-8),
            localPort: localPort,
            remotePort: remotePort,
        };
    }

    public buildCanRaw(buffer: Buffer): ICanRaw {
        return {
            raw: buffer,
        };
    }

    public buildCanStates(cans: ICan[]): ICanState[] {
        return cans.map((can: ICan) => this.buildCanState(can)).reduce((pre, cur) => [...pre, ...cur]);
    }

    public buildCanState(can: ICan): ICanState[] {
        const pgnID = this.transform.decodePGN(can.canID);
        const spns = this.spnCache.retrieveSpnsByPgnFromCache(pgnID);

        if (!spns) {
            return [];
        }

        const canStates = new Array<ICanState>();
        for (const spn of spns!) {
            const val = this.transform.decodeData(can.canData, spn);
            const state: ICanState = {
                canObjID: can._id,
                vcode: can.remotePort.toString(),
                spnNo: spn.SPNNo,
                spnName: spn.SPNName,
                pgnNo: pgnID,
                pgnName: spn.PGNName,
                value: val,
                unit: spn.Unit,
                min: spn.LowerDataRange,
                max: spn.UpperDataRange,
            };
            canStates.push(state);
        }

        return canStates;
    }
}
