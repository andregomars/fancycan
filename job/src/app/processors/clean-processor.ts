import { CanRepository, ConfigUtility } from 'fancycan-common';
import { startOfToday, subDays } from 'date-fns';

export class CleanProceccor {

    public async run() {
        console.log(`Start ${CleanProceccor.name}...`);
        const canRepo = new CanRepository();
        const cutoffDate = subDays(startOfToday(), ConfigUtility.);
        const result = await canRepo.cleanHistory(cutoffDate);

        console.log(`Clean history records before ${cutoffDate} from CAN: ${result.nRemoved}`);

    }
}
