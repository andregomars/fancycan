import { Buffer } from 'buffer/';
import { ICanState, ICan, IJ1939, ViewProfileStateModel } from 'fancycan-model';
import { ObjectID } from 'mongodb';
import { CanRepository, VehicleRepository } from '../src/repository';
import { SpnCache, ViewProfileCache } from '../src/cache';

describe('When test Vehicle Repository', () => {
    const spnCache = new SpnCache();
    const viewProfileCache = new ViewProfileCache();

    const sample9004: ICan = {
        _id: new ObjectID(),
        rawID: new ObjectID(),
        delimiter: Buffer.from('88', 'hex'),
        canID: Buffer.from('GPwWIQ==', 'base64'),
        canData: Buffer.from('BAQAAFQCACA=', 'base64'),
        localPort: 5888,
        remotePort: 6005,
    };
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
    const v6005profile: ViewProfileStateModel = {
        fcode: 'BYD',
        fname: 'BYD',
        vcode: '6005',
        vin: 'BYDW21312312005'
    };

    beforeAll(() => {
        spnCache.storeSpnsIntoCacheGroupedByPgn([def9004]);
        viewProfileCache.storeViewProfileIntoCacheGroupedByVehicleCode([v6005profile]);

    });

    it('should build viechle states', () => {
        const canRepo = new CanRepository();
        const vehicleRepo = new VehicleRepository();
        const canStates: ICanState[] = canRepo.buildCanState(sample9004);
        const actual = vehicleRepo.buildVehicleState(canStates[0]);
        expect(canStates).toBeDefined();
        expect(actual).toBeDefined();
        expect(actual!.vcode).toEqual('6005');
        expect(actual!.vin).toEqual('BYDW21312312005');
        expect(actual!.fcode).toEqual('BYD');
        expect(actual!.spn9004).toEqual(596);
    });
});
