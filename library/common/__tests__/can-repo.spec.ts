import { Buffer } from 'buffer/';
import { ICanState, ICan, IJ1939 } from 'fancycan-model';
import { ObjectID } from 'mongodb';
import { SpnCache } from '../src/cache';
import { CanRepository } from '../src/repository';
import { MongoLayer } from '../src/core';

describe('When test CAN repo', () => {
    const spnCache = new SpnCache();

    const def9004: IJ1939 = {
        Code: 'voltage',
        SPNNo: 9004,
        SPNName: 'Motor Voltage',
        PGNNo: 64534,
        PGNName: '',
        StartByte: 5,
        StartBit: 1,
        Length: 16,
        Resolution: 1,
        Offset: 0,
        Unit: 'V',
        LowerDataRange: 0,
        UpperDataRange: 800,
        Status: {
            Name: '',
            Description: [],
        },
    };

    const sample9004: ICan = {
        _id: new ObjectID(),
        rawID: new ObjectID(),
        delimiter: Buffer.from('88', 'hex'),
        canID: Buffer.from('GPwWIQ==', 'base64'),
        canData: Buffer.from('BAQAAFQCACA=', 'base64'),
        localPort: 5888,
        remotePort: 6005,
    };

    beforeAll(() => {
        spnCache.storeSpnsIntoCacheGroupedByPgn([def9004]);
    });

    it('should get CAN state', () => {
        const canRepo = new CanRepository();
        const actual: ICanState[] = canRepo.buildCanState(sample9004);
        expect(actual.length).toBe(1);
    });

    it('should able to build object id by givin date', () => {
        const expected = new ObjectID('5c8372800000000000000000');
        const date20190309 = new Date(2019, 2, 9);
        const actual =  ObjectID.createFromTime(date20190309.getTime() / 1000);

        expect(actual).toEqual(expected);
    });

});
