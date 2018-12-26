import { TransformService } from './../src/app/services/transform.services';
import { DataLayer } from '../src/app/datalayer';
import { FireLayer } from '../src/app/firelayer';
import { MongoClient, ObjectID } from 'mongodb';
import { ICan } from '../src/app/models/ICanData';

jest.mock('mongodb');
jest.mock('../src/app/firelayer');

describe('When test transform', () => {
    it('get spn from header', () => {
        const MongoClientMock = jest.fn<MongoClient>(() => ({
            // send: jest.fn(),
        }));
        const mongoClient = new MongoClientMock();
        const dataLayer = new DataLayer(mongoClient);
        const fireLayer = new FireLayer();
        const transformService = new TransformService(dataLayer, fireLayer);
        // const can: ICan = {
        //     rawID: new ObjectID(121212121),
        //     delimiter: Buffer.from('88', 'hex'),
        //     canID: Buffer.from('1F', 'hex'),
        //     canData: Buffer.from('1F', 'hex'),
        //     localPort: 5888,
        //     remotePort: 6005,
        // };

        const canID = Buffer.from('1F', 'hex');
        const actual = transformService.decodePGN(canID);
        expect(actual).toBe(2);
  });
});
