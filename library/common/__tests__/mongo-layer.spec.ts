import { MongoLayer } from '../src/core';
import { ObjectID } from 'mongodb';

describe('When test MongoLayer', () => {
    it.skip('should able to insert one doc into main.can with object id @ 03/05', async () => {
        await MongoLayer.getInstance().connect();
        const conn = MongoLayer.getInstance().Client;

        const today = new Date();
        const date20190309 = new Date(2019, 2, 9, today.getHours(), today.getMinutes(), today.getSeconds());
        const dateOID =  ObjectID.createFromTime(date20190309.getTime() / 1000);

        try {
            const result =
                await conn.db('main').collection('can').insertOne({
                    _id: dateOID,
                    greeting: `hello @ ${date20190309}`
                });
            const actual = result.insertedCount;
            expect(actual).toEqual(1);

        } catch (err) {
            expect(err).toBeUndefined();

        } finally {
            conn.close();
        }

    });

});
