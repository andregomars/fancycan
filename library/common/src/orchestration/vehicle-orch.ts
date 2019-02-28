import { ObjectID } from 'bson';
import { format } from 'date-fns';

import { ICanState, IVehicleState, IRuleEvent } from 'fancycan-model';
import { VehicleRepository, UserRepository } from '../repository';
import { ConfigUtility } from '../utility';

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

    public async saveVehicleMalfuncStateDoc(vehicleState: IVehicleState, ruleEvent: IRuleEvent): Promise<ObjectID> {
        const mState = this.vehicleRepo.buildVehicleMalfuncState(vehicleState, ruleEvent);
        const result = await this.vehicleRepo.insertVehicleMalfuncState(mState);
        return result.insertedId;
    }

    public async notifyMalfunctionSubscribers(vehicleState: IVehicleState, ruleEvent: IRuleEvent, malfuncDocID?: ObjectID) {
        const subject = 'fancycan.com - Malfunction Notification';
        const urlAppWeb = ConfigUtility.getCommonConfig('urlAppWeb');
        const html = `
            <h1>Dear fleet ${ vehicleState.fname } users:</h1>
            <p>&nbsp;&nbsp;Please pay attention there is a malfunction reported from vehicle code ${ vehicleState.vcode } with VIN ${ vehicleState.vin }.</p>
            <p><b>Event Time: </b>${ format(vehicleState.createDate, 'MM/DD HH:mm:ss') }</p>
            <p><b>Related Malfunction Setting: </b></p>
            <ul>
                <li>ID: ${ ruleEvent.params.id }</li>
                <li>Name: ${ ruleEvent.params.name }</li>
                <li>Level: ${ ruleEvent.params.level }</li>
            </ul>
            <p><a href="${ urlAppWeb }/vehicle/malfunctions/${ vehicleState.vcode }">See Detail</a></p>
            <p>Thanks!</p>
        `;
        await this.userRepo.notifyUsers(subject, html, ruleEvent.params.notification);

    }
}
