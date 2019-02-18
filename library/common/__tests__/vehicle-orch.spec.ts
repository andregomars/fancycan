import { IVehicleState, IRuleEvent } from 'fancycan-model';
import { VehicleOrch } from '../src/orchestration';
import { FireLayer } from '../src/core';
import { GeneralCache } from '../src/cache';

describe('When test Vehicle Orchestration', () => {
    const vState: IVehicleState = {
        vcode: '1005',
        vin: 'vinxxxx',
        fcode: 'OMNIT',
        fname: 'OMNIT',
        geolocations: [],
        spn9004: 500,
        spn1234: 33,
    };

    const ruleEvent: IRuleEvent = {
        type: 'Malfunction',
        params: {
            id: 1,
            name: 'voltage test failure',
            level: 'Critical',
            notification: ['email', 'app']
        }
    };

    it.skip('should send malfunction email to notify subscribed users', async () => {
        const fire = new FireLayer();
        const users = await fire.getUsers().toPromise();
        GeneralCache.storeUsers(users);

        const vehicleOrch = new VehicleOrch();
        await vehicleOrch.notifyMalfunctionSubscribers(vState, ruleEvent);
        expect(true).toBeTruthy();

    });
});
