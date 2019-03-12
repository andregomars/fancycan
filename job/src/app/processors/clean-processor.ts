import { ConfigUtility, RepositoryCommon } from 'fancycan-common';
import { startOfToday, subDays } from 'date-fns';

const DB_MAIN = 'main';
const COLL_CAN_RAW = 'can_raw';
const COLL_CAN = 'can';
const COLL_CAN_STATE = 'can_state';

export class CleanProcessor {

    public async run() {
        console.log(`Start ${CleanProcessor.name}...`);
        const cutoffDate = this.getCutoffDate();
        const repo = new RepositoryCommon();

        const cleanCollections = [COLL_CAN_RAW, COLL_CAN];

        for (const collection of cleanCollections) {
            const result = await repo.cleanCollectionHistory(cutoffDate, DB_MAIN, collection);
            console.log(`Cleaned history records before ${cutoffDate.toDateString()} from ${DB_MAIN.toUpperCase()}.${collection.toUpperCase()}: ${result.nRemoved}`);
        }

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
