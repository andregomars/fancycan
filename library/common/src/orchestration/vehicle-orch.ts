import { ICanState, IVehicleState, IRuleEvent, IVehicleMalfuction } from 'fancycan-model';
import { VehicleRepository, UserRepository } from '../repository';

export class VehicleOrch {
    private vehicleRepo: VehicleRepository;
    private userRepo: UserRepository;

    public constructor() {
        this.vehicleRepo = new VehicleRepository();
        this.userRepo = new UserRepository();
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

    public async notifyMalfunctionSubscribers(vehicleState: IVehicleState, ruleEvent: IRuleEvent) {
        const subject = 'fancycan.com - Malfunction Notification';
        const html = `
            <h1>Dear fleet ${ vehicleState.fname } users:</h1>
            <p>&nbsp;&nbsp;Please pay attention there is malfunction record reported from vehicle code ${ vehicleState.vcode } with VIN ${ vehicleState.vin }.</p>
            <ul>
                <li>Malfunction ID: ${ ruleEvent.params.id }</li>
                <li>Malfunction Name: ${ ruleEvent.params.name }</li>
                <li>Malfunction Level: ${ ruleEvent.params.level }</li>
            </ul>
            <p>Thanks!</p>
        `;
        await this.userRepo.notifyUsers(subject, html, ruleEvent.params.notification);

    }
}
