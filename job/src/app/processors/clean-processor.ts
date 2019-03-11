import { CanRepository, ConfigUtility } from 'fancycan-common';
import { startOfToday, subDays } from 'date-fns';

export class CleanProcessor {

    public async run() {
        console.log(`Start ${CleanProcessor.name}...`);
        const canRepo = new CanRepository();
        const cutoffDate = this.getCutoffDate();

        const result = await canRepo.cleanHistory(cutoffDate);
        console.log(`Clean history records before ${cutoffDate.toDateString()} from CAN: ${result.nRemoved}`);

    }

    private getCutoffDate(): Date {
        // remove data over than 3 calendars back by default if not specified in configuration.
        let backupDays = 3;
        const processors = ConfigUtility.getJobProcessors();
        const proc = processors.find((p) => p.name === CleanProcessor.name);
        if (proc) {
            backupDays = Number(proc.backupDays);
        }

        const cutoffDate = subDays(startOfToday(), backupDays);
        return cutoffDate;
    }
}
