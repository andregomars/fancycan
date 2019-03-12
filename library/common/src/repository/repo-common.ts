import { MongoClient, BulkWriteResult, ObjectID } from 'mongodb';
import { MongoLayer } from '../core';

export class RepositoryCommon {
    private conn: MongoClient;

    public constructor() {
        this.conn = MongoLayer.getInstance().Client;
    }

    public async cleanCollectionHistory(cutoffDate: Date, dbName: string, collName: string): Promise<BulkWriteResult> {
        const cutoffOID =  ObjectID.createFromTime(cutoffDate.getTime() / 1000);

        const bulk = this.conn.db(dbName).collection(collName).initializeUnorderedBulkOp();
        bulk.find({ _id: { $lt: cutoffOID }}).remove();
        return await bulk.execute();
    }
}