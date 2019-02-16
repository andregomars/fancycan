import { ICanState, IVehicleState, IRuleEvent } from 'fancycan-model';
import { VehicleRepository } from '../repository';

export class VehicleOrch {
    private vehicleRepo: VehicleRepository;

    public constructor() {
        this.vehicleRepo = new VehicleRepository();
    }

    public async saveVehicleStateDoc(canState: ICanState) {
        const state = this.vehicleRepo.buildVehicleState(canState);
        if (!state) {
            console.log(`vehicle state build failed for vcode : ${canState.vcode} & can objID: ${canState.vcode}`);
            return;
        }
        await this.vehicleRepo.upsertVehicleState(state);
    }

    public async saveVehicleMalfuncStateDoc(vehicleState: IVehicleState, ruleEvent: IRuleEvent) {
        const mState = this.vehicleRepo.buildVehicleMalfuncState(vehicleState, ruleEvent);
        await this.vehicleRepo.insertVehicleMalfuncState(mState);
    }

}
