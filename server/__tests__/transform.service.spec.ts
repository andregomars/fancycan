import { TransformService } from './../src/app/services/transform.services';
import { ObjectID } from 'mongodb';
import { ICan } from '../src/app/models/ICanData';
import { IJ1939 } from '../src/app/models/IJ1939';
import { ICanState } from '../src/app/models/ICanState';
import { Utility } from '../src/app/services/utility';
import { Readable } from 'stream';
const chunker = require('stream-chunker');

jest.mock('mongodb');
jest.mock('../src/app/firelayer');

describe('When test transform', () => {
    // const MongoClientMock = jest.fn<MongoClient>(() => ({
        // send: jest.fn(),
    // }));
    const transformService = new TransformService();
    const utility = new Utility();
    const canRawSample = 'iAzwAgPN/////////4gY8wkAAA8AAAAAAHGIGPwA9AAAABgAAABmiAj+bgsCHy8fnx4LH4gY/Af0oAmgCUgCWYiIGPwUIQAAAABcAgAAiAzwAgPN/////////4gM0i8nABGgAAAAAACIGO8ZIX9f////////iBj68iGgCgAVAqoKAIgY/BchhjQAAAAAAMSIGPwE9EQBBTo5O3MSiBj+vwsFH3t/e3///4gY/+EZQKQAAs8wMACIGP/iGU08Of/M/8z/iAzwAgPN/////////4gY/+MZbgAWAf////+IGOz/GSAKAAL/yv4AiBjw1hn//////wA//4gI/m4L1R4CH94eSh8=';

    beforeAll(() => {
        utility.storeSpnsIntoCacheGroupedByPgn([def9004, def2911]);
    });

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
        // _id: new ObjectID(),
        rawID: new ObjectID(),
        delimiter: Buffer.from('88', 'hex'),
        canID: Buffer.from('GPwWIQ==', 'base64'),
        canData: Buffer.from('BAQAAFQCACA=', 'base64'),
        localPort: 5888,
        remotePort: 6005,

    };

    const sample9006: ICan = {
        // _id: new ObjectID(),
        rawID: new ObjectID(),
        delimiter: Buffer.from('88', 'hex'),
        canID: Buffer.from('GPwL9A==', 'base64'),
        canData: Buffer.from('YABF/hcAUXM=', 'base64'),
        localPort: 5888,
        remotePort: 6005,
    };

    const sample2911: ICan = {
        // _id: new ObjectID(),
        rawID: new ObjectID(),
        delimiter: Buffer.from('88', 'hex'),
        canID: Buffer.from('GPABCw==', 'base64'),
        canData: Buffer.from('z//w//8BC/8=', 'base64'),
        localPort: 5888,
        remotePort: 6005,
    };

    it('get spn from header', () => {
        const actual = transformService.decodePGN(sample9004.canID);
        expect(actual).toBe(64534);
    });

    it('get correct value from sample spn# 9004', () => {
        const actual = transformService.decodeData(sample9004.canData, def9004);
        expect(actual).toBe(596);
    });

    it('get correct value from sample spn# 9006', () => {
        const actual = transformService.decodeData(sample9006.canData, def9006);
        expect(actual).toBe(105.8);
    });

    it('get correct value from sample spn# 2911', () => {
        const actual = transformService.decodeData(sample2911.canData, def2911);
        expect(actual).toBe(3);
    });

    it('should get CAN state', () => {
        const actual: ICanState[] = transformService.getCanState(sample9004);
        expect(actual.length).toBe(1);
    });

    // it('should split buffer through Splitter properly', ( done ) => {
    //     expect.assertions(1);

    //     let total = 0;
    //     const stream = new Readable({
    //         read() {
    //             return;
    //         },
    //     });
    //     const STX = 0x88;
    //     const buffer = Buffer.from(canRawSample, 'base64');

    //     stream.pipe(new Splitter({
    //         startWith: STX,
    //     })).on('data', (chunk: Buffer) => {
    //         total += 1;
    //     }).on('end', () => {
    //         expect(total).toBe(20);
    //         done();
    //     });

    //     stream.push(buffer);
    //     stream.push(null);
    // });

    it('should split buffer through stream-chunker properly', ( done ) => {
        expect.hasAssertions();

        let total = 0;
        const stream = new Readable({
            read() {
                return;
            },
        });
        const buffer = Buffer.from(canRawSample, 'base64');

        stream.pipe(chunker(13))
            .on('data', (chunk: Buffer) => {
                total += 1;
            }).on('end', () => {
                expect(total).toBe(20);
                done();
            });

        stream.push(buffer);
        stream.push(null);
    });
});
