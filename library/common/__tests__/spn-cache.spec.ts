import { IJ1939 } from 'fancycan-model';
import { SpnCache } from '../src/cache';

describe('When test utility', () => {
    const spnCache = new SpnCache();

    beforeAll(() => {
        spnCache.storeSpnsIntoCacheGroupedByPgn([def9004, def2911]);
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

    it('should get spn list', () => {
        const actual = spnCache.retrieveSpnsByPgnFromCache(64534);
        expect(actual).toBeDefined();
        expect(actual!.length).toBe(1);
    });

});
