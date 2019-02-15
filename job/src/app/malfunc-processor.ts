import { VehicleRepository, MalfuncSettingCache } from 'fancycan-common';
import { RuleEngine } from './rule-engine';

export class MalfuncProceccor {

    public async run() {
        const settings = new MalfuncSettingCache().retrieveMalfuncSettingFromCache();
        const vehicleRepo = new VehicleRepository();

        console.log(settings);
        const rules = new RuleEngine().buildMalfunctionRules(settings);
        console.log(JSON.stringify(rules))
        process.exit();
        const engine = new RuleEngine().createEngineWithRules(settings);

        const states = await vehicleRepo.getVehicleStates();
        console.log(states);
        for (const stateFact of states) {
            const events = await engine.run(stateFact);
            console.log(events);
        }

    }
}
