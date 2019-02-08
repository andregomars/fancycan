import { ICan } from 'fancycan-model';
import { CanRepository } from '../repository';
import { VehicleOrch } from './vehicle-orch';

export class CanOrch {
    private canRepo: CanRepository;
    private vehicleOrch: VehicleOrch;

    public constructor() {
        this.canRepo = new CanRepository();
        this.vehicleOrch = new VehicleOrch();
    }

    public async saveCanDoc(doc: ICan) {
        await this.canRepo.insertCan(doc);
        const states = this.canRepo.buildCanState(doc);
        if (states.length > 0) {
            await this.canRepo.insertCanStates(states);
            for (const canState of states) {
                await this.vehicleOrch.saveVehicleStateDoc(canState);
                await this.vehicleOrch.saveVehicleMalfuncStateDoc(canState);
            }
        }
    }
}
