import { MongoLayer } from '../src/core';

describe('When test MongoLayer', () => {

    // it('should able to insert one doc into mongodb', async () => {
    //     await MongoLayer.getInstance().connect();
    //     const conn = MongoLayer.getInstance().Client;

    //     try {
    //         const result =
    //             await conn.db('mydb').collection('mycoll').insertOne({ greeting: 'hello' });
    //         const actual = result.insertedCount;
    //         expect(actual).toEqual(1);

    //     } catch (err) {
    //         expect(err).toMatch('error');
    //     }

    //     conn.close();
    // });

    it('should able to connect mongodb', async () => {
        await MongoLayer.getInstance().connect();
        const conn = MongoLayer.getInstance().Client;
        expect(true).toBeTruthy();
        conn.close();
    });
});
