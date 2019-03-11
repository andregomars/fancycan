import { VehicleRepository, MalfuncSettingCache, VehicleOrch } from 'fancycan-common';
import { RuleEngine } from './../rule-engine';

export class MalfuncProcessor {

    public async run() {
        console.log(`Start ${MalfuncProcessor.name}...`);
        const settings = new MalfuncSettingCache().retrieveMalfuncSettingFromCache();
        const vehicleRepo = new VehicleRepository();
        const vehicleOrch = new VehicleOrch();

        const rules = new RuleEngine().buildMalfunctionRules(settings);
        const engine = new RuleEngine().createEngineWithRules(rules);

        const states = await vehicleRepo.getVehicleStates();

        for (const state of states) {
            // clone state into fact in order to avoid object altering in engine.run()
            const fact = Object.assign({}, state);
            const events = await engine.run(fact);

            // init date for malfunc states
            state.createDate = new Date();
            state.editDate = null;

            for (const event of events) {
                const malfuncID = await vehicleOrch.saveVehicleMalfuncStateDoc(state, event);
                await vehicleOrch.notifyMalfunctionSubscribers(state, event);
            }
        }

    }
}
