import { VehicleRepository, MalfuncSettingCache } from 'fancycan-common';
import { RuleEngine } from './rule-engine';

export class MalfuncProceccor {

    public async run() {
        const settings = new MalfuncSettingCache().retrieveMalfuncSettingFromCache();
        const vehicleRepo = new VehicleRepository();

        const rules = new RuleEngine().buildMalfunctionRules(settings);
        const engine = new RuleEngine().createEngineWithRules(rules);

        const states = await vehicleRepo.getVehicleStates();
        console.log(states);
        for (const stateFact of states) {
            const events = await engine.run(stateFact);
            console.log(events);
        }

    }
}
