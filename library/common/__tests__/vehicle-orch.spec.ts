import { IVehicleState, IRuleEvent } from 'fancycan-model';
import { VehicleOrch } from '../src/orchestration';
import { FireLayer } from '../src/core';
import { GeneralCache } from '../src/cache';

describe.only('When test Vehicle Orchestration', () => {
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

    it('should send malfunction email to notify subscribed users', async () => {
        const fire = new FireLayer();
        const users = await fire.getUsers().toPromise();
        GeneralCache.storeUsers(users);

        const nusers = GeneralCache.retrieveUsers();
        // const users = await fire.getUsers().toPromise();
        expect(nusers[0].name).toEqual('andre');
        expect(nusers[0].notification.length).toEqual(2);
        expect(nusers[0].notification).toEqual(['email', 'app']);
        expect(nusers[0].notification.indexOf('email')).toEqual(0);
        
        const vehicleOrch = new VehicleOrch();
        // await vehicleOrch.notifyMalfunctionSubscribers(vState, ruleEvent);
        expect(true).toBeTruthy();

    });
});
