import { IJ1939, ViewProfileStateModel } from 'fancycan-model';
import { ViewProfileRepository } from '../src/repository/view-profile-repo';

describe('When test utility', () => {
    const repo = new ViewProfileRepository();

    const flattedVehicles: ViewProfileStateModel[] = [
        {
            fcode: 'OMNIT',
            fname: 'OMNIT',
            vcode: '5001',
            vin: 'XZW21312312001'
        },
        {
            fcode: 'OMNIT',
            fname: 'OMNIT',
            vcode: '5002',
            vin: 'XZW21312312002'
        },
        {
            fcode: 'OMNIT',
            fname: 'OMNIT',
            vcode: '5003',
            vin: 'XZW21312312003'
        },
        {
            fcode: 'BYD',
            fname: 'BYD',
            vcode: '6001',
            vin: 'BYDW21312312001'
        },
        {
            fcode: 'BYD',
            fname: 'BYD',
            vcode: '6002',
            vin: 'BYDW21312312002'
        }
    ];

    beforeAll(() => {
        repo.storeViewProfileIntoCacheGroupedByVehicleCode(flattedVehicles);
    });

    it('should get vehicle profile list', () => {
        const actual = repo.retrieveViewProfileByVehicleCodeFromCache('6001');
        expect(actual).toBeDefined();
        expect(actual!.vcode).toEqual('6001');
        expect(actual!.fname).toEqual('BYD');
        expect(actual!.vin).toEqual('BYDW21312312001');
    });

});
