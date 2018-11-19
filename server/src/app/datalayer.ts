import assert from 'assert';
import { MongoClient, Db } from 'mongodb';

export class DataLayer {
    private url = 'mongodb://localhost:27017';
    private client: MongoClient;

    constructor() {
        this.client = new MongoClient(this.url, { useNewUrlParser: true });
    }

    public insertDocs(buffer: Buffer, ip: string) {
        console.log('start insert docs');
        try {
            this.client.connect((err) => {
                assert.equal(null, err);
                console.log('connected to mongodb instance');
                const db = this.client.db('mydb');
                const collection = db.collection('customers');
                const docs = [{
                    raw: buffer,
                    ip: ip,
                    time: new Date(),
                }];
                collection.insertMany(docs, (inerr, result) => {
                    assert.equal(inerr, null);
                    console.log('insert docs into collection customers');
                });
            });
        } catch (error) {
            console.log(error);
        } finally {
            this.client.close();
        }
    }
}
