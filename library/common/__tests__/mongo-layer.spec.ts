import { MongoLayer } from '../src/core';
import { MongoClient } from 'mongodb';

describe('When test MongoLayer', () => {
    // let conn: MongoClient;

    // beforeAll(async () => {
        // await MongoLayer.getInstance().connect();
        // conn = MongoLayer.getInstance().Client;
    // });

    // afterAll(() => {
        // conn.close();
    // });

    it('should able to insert one doc into mydb.mycoll', async () => {
        await MongoLayer.getInstance().connect();
        const conn = MongoLayer.getInstance().Client;

        try {
            const result =
                await conn.db('mydb').collection('mycoll').insertOne({ greeting: 'hello' });
            const actual = result.insertedCount;
            expect(actual).toEqual(1);

        } catch (err) {
            expect(err).toBeUndefined();
        }

        conn.close();
    });

});
