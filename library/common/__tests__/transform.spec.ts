import { ObjectID } from 'bson';
import { Buffer } from 'buffer/';

import { ICan, IJ1939, Dm1Collection, Dm1EntryType, ViewProfileStateModel } from 'fancycan-model';
import { SpnCache, ViewProfileCache } from '../src/cache';
import { TransformUtility } from 'fancycan-utility';
// const chunker = require('stream-chunker');

// jest.mock('mongodb');
// jest.mock('../src/app/firelayer');

describe('When test transform', () => {
    const transform = new TransformUtility();
    const spnCache = new SpnCache();
    const viewProfileCache = new ViewProfileCache();
    // const canRawSample = 'iAzwAgPN/////////4gY8wkAAA8AAAAAAHGIGPwA9AAAABgAAABmiAj+bgsCHy8fnx4LH4gY/Af0oAmgCUgCWYiIGPwUIQAAAABcAgAAiAzwAgPN/////////4gM0i8nABGgAAAAAACIGO8ZIX9f////////iBj68iGgCgAVAqoKAIgY/BchhjQAAAAAAMSIGPwE9EQBBTo5O3MSiBj+vwsFH3t/e3///4gY/+EZQKQAAs8wMACIGP/iGU08Of/M/8z/iAzwAgPN/////////4gY/+MZbgAWAf////+IGOz/GSAKAAL/yv4AiBjw1hn//////wA//4gI/m4L1R4CH94eSh8=';

    beforeAll(() => {
        spnCache.storeSpnsIntoCacheGroupedByPgn([def9004, def2911]);
        viewProfileCache.storeViewProfileIntoCacheGroupedByVehicleCode(flattedVehicles);

    });

    const flattedVehicles: ViewProfileStateModel[] = [
        {
            fcode: 'BYD',
            fname: 'BYD',
            vcode: '6005',
            vin: 'BYDW21312312005'
        }
    ];

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

    const def9006: IJ1939 = {
        Code: 'hitemp_battery',
        SPNNo: 9006,
        SPNName: 'H-C Battery Temp',
        PGNNo: 64523,
        PGNName: '',
        StartByte: 7,
        StartBit: 1,
        Length: 8,
        Resolution: 1.8,
        Offset: -40,
        Unit: 'F',
        LowerDataRange: 0,
        UpperDataRange: 220,
        Status: {
            Name: '',
            Description: [],
        },
    };

    const def2911 = {
        Code: 'brakeswitch',
        SPNNo: 2911,
        SPNName: 'Halt brake switch',
        PGNNo: 61441,
        PGNName: 'Electronic Brake Controller 1',
        StartByte: 8,
        StartBit: 3,
        Length: 2,
        Resolution: 1,
        Offset: 0,
        Unit: 'bit',
        LowerDataRange: 0,
        UpperDataRange: 3,
        Status: {
            Name: 'Active/Error',
            Description: [
                'Not active',
                'Active',
                'Error',
                'Not available',
            ],
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

    const sample9006: ICan = {
        _id: new ObjectID(),
        rawID: new ObjectID(),
        delimiter: Buffer.from('88', 'hex'),
        canID: Buffer.from('GPwL9A==', 'base64'),
        canData: Buffer.from('YABF/hcAUXM=', 'base64'),
        localPort: 5888,
        remotePort: 6005,
    };

    const sample2911: ICan = {
        _id: new ObjectID(),
        rawID: new ObjectID(),
        delimiter: Buffer.from('88', 'hex'),
        canID: Buffer.from('GPABCw==', 'base64'),
        canData: Buffer.from('z//w//8BC/8=', 'base64'),
        localPort: 5888,
        remotePort: 6005,
    };

    it('get spn from header', () => {
        const actual = transform.decodePGN(sample9004.canID);
        expect(actual).toEqual(64534);
    });

    it('get correct value from sample spn# 9004', () => {
        const actual = transform.decodeData(sample9004.canData, def9004);
        expect(actual).toEqual(596);
    });

    it('get correct value from sample spn# 9006', () => {
        const actual = transform.decodeData(sample9006.canData, def9006);
        expect(actual).toEqual(105.8);
    });

    it('get correct value from sample spn# 2911', () => {
        const actual = transform.decodeData(sample2911.canData, def2911);
        expect(actual).toEqual(3);
    });

    // it('should split buffer through stream-chunker properly', ( done ) => {
    //     expect.hasAssertions();

    //     let total = 0;
    //     const stream = new Readable({
    //         read() {
    //             return;
    //         },
    //     });
    //     const buffer = Buffer.from(canRawSample, 'base64');

    //     stream.pipe(chunker(13))
    //         .on('data', (chunk: Buffer) => {
    //             total += 1;
    //         }).on('end', () => {
    //             expect(total).toBe(20);
    //             done();
    //         });

    //     stream.push(buffer);
    //     stream.push(null);
    // });

    it('should get J1939 value from CAN data', () => {
        const buffer = Buffer.from('BAQAAFQCACA=', 'base64');
        const startBit = 33;
        const length = 16;
        const actual = transform.decodeJ1939(buffer.toString('hex'), startBit, length);

        const expected = 596;
        expect(actual).toEqual(expected);
    });

    it('should get J1939 value from CAN data', () => {
        const buffer = '7F5FFFFFFFFFFFFF';
        const startBit = 33;
        const length = 8;
        const actual = transform.decodeJ1939(buffer, startBit, length);

        const expected = 255;
        expect(actual).toEqual(expected);
    });

    it('should get single DM1 value from CAN data', () => {
        const canData = '10FF6F020101FFFF';
        const dm1Collection: Dm1Collection = {
            lamp: 0,
            packetsCount: 0,
            entriesCount: 0,
            entriesBuffer: Buffer.alloc(0),
            data: []
        };
        const actual = transform.decodeDm1(canData, Dm1EntryType.Single, dm1Collection);

        expect(actual).toBeDefined();
        expect(actual.lamp).toEqual(16);
        expect(actual.packetsCount).toEqual(1);
        expect(actual.entriesCount).toEqual(1);
        expect(actual.data.length).toEqual(1);
        expect(actual.data[0].spn).toEqual(623);
        expect(actual.data[0].fmi).toEqual(1);
        expect(actual.data[0].count).toEqual(1);
    });

    it('should get multiple DM1 values from CAN data', () => {
        let dm1Collection: Dm1Collection = {
            lamp: 0,
            packetsCount: 0,
            entriesCount: 0,
            entriesBuffer: Buffer.alloc(0),
            data: []
        };
        dm1Collection = transform.decodeDm1('200AFFFFFFCAFE00', Dm1EntryType.MultiHeader, dm1Collection);
        dm1Collection = transform.decodeDm1('0110FF640001013D', Dm1EntryType.MultiData, dm1Collection);
        const actual = transform.decodeDm1('020B0101FFFFFFFF', Dm1EntryType.MultiData, dm1Collection);

        expect(actual).toBeDefined();
        expect(actual.packetsCount).toEqual(2);
        expect(actual.entriesCount).toEqual(2);
        expect(actual.lamp).toEqual(16);
        expect(actual.entriesBuffer.toString('hex').toUpperCase()).toEqual('10FF640001013D0B0101FFFFFFFF');
        expect(actual.data.length).toEqual(2);
        expect(actual.data[0].spn).toEqual(100);
        expect(actual.data[0].fmi).toEqual(1);
        expect(actual.data[0].count).toEqual(1);
        expect(actual.data[1].spn).toEqual(2877);
        expect(actual.data[1].fmi).toEqual(1);
        expect(actual.data[1].count).toEqual(1);
    });

});
