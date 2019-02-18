import { VehicleRepository, MalfuncSettingCache, VehicleOrch, UserRepository } from 'fancycan-common';
import { RuleEngine } from './rule-engine';

export class MalfuncProceccor {

    public async run() {
        const settings = new MalfuncSettingCache().retrieveMalfuncSettingFromCache();
        const vehicleRepo = new VehicleRepository();
        const vehicleOrch = new VehicleOrch();

        const rules = new RuleEngine().buildMalfunctionRules(settings);
        const engine = new RuleEngine().createEngineWithRules(rules);

        const states = await vehicleRepo.getVehicleStates();

        // console.log(new UserRepository().getUsers());
        // console.log(settings);

        for (const state of states) {
            // clone state into fact in order to avoid object altering in engine.run()
            const fact = Object.assign({}, state);
            const events = await engine.run(fact);

            // init date for malfunc states
            state.createDate = new Date();
            state.editDate = null;

            for (const event of events) {
                await vehicleOrch.saveVehicleMalfuncStateDoc(state, event);
                await vehicleOrch.notifyMalfunctionSubscribers(state, event);
            }
        }

    }
}
