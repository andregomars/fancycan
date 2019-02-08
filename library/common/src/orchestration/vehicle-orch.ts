import { ICanState, IVehicleState, Geolocation } from 'fancycan-model';
import { ViewProfileCache } from '../cache';
import { VehicleRepository } from '../repository';

export class VehicleOrch {
    private viewProfileCache: ViewProfileCache;
    private vehicleRepo: VehicleRepository;

    public constructor() {
        this.viewProfileCache = new ViewProfileCache();
        this.vehicleRepo = new VehicleRepository();
    }

    public async saveVehicleStateDoc(canState: ICanState) {
        const state = this.buildVehicleState(canState);
        if (!state) {
            console.log(`vehicle state build failed for vcode : ${canState.vcode} & can objID: ${canState.vcode}`);
            return;
        }
        await this.vehicleRepo.upsertVehicleState(state);
    }

    public async saveVehicleMalfuncStateDoc(canState: ICanState) {
        if (canState.spnNo === 190 && canState.value > 800) {
            const state = this.vehicleRepo.buildVehicleMalfuncState(canState);
            await this.vehicleRepo.insertVehicleMalfuncState(state);
        }
    }

    public buildVehicleState(canState: ICanState): IVehicleState | undefined {
        const geolocations: Geolocation[] = [
            { latitude: 34.057539, longitude: -118.237494 },
            { latitude: 34.056544, longitude: -118.238082 },
            { latitude: 34.055955, longitude: -118.238996 },
            { latitude: 34.056325, longitude: -118.239507 },
        ];
        const viewProfile = this.viewProfileCache.retrieveViewProfileByVehicleCodeFromCache(canState.vcode);
        if (!viewProfile) {
            return undefined;
        }

        const state: IVehicleState = {
            vcode: canState.vcode,
            vin: viewProfile.vin,
            fcode: viewProfile.fcode,
            fname: viewProfile.fname,
            geolocations: geolocations,
        };
        state['spn' + canState.spnNo] = canState.value;
        return state;
    }
}
