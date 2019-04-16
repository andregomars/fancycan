import { ConfigUtility, RepositoryCommon } from 'fancycan-common';
import { startOfToday, subDays } from 'date-fns';

const DB_MAIN = 'main';
// const COLL_CAN_RAW = 'can_raw';
// const COLL_CAN = 'can';
// const COLL_CAN_STATE = 'can_state';

export class CleanProcessor {

    public async run() {
        console.log(`Start ${CleanProcessor.name}...`);
        const options = this.getOptions();
        const repo = new RepositoryCommon();

        // const cleanCollections = [COLL_CAN_RAW, COLL_CAN];

        for (const collection of options.collections) {
            const result = await repo.cleanCollectionHistory(options.cutoff, DB_MAIN, collection);
            console.log(`Cleaned history records before ${options.cutoff.toDateString()} 
                from ${DB_MAIN.toUpperCase()}.${collection.toUpperCase()}: ${result.nRemoved}`);
        }

    }

    private getOptions(): CleanProcessorOptions {
        // remove data over than 3 calendars back by default if not specified in configuration.
        let collections = [];
        let backupDays = 3;
        const processors = ConfigUtility.getJobProcessors();
        const proc = processors.find((p) => p.name === CleanProcessor.name);
        if (proc) {
            backupDays = Number(proc.backupDays);
            collections = proc.collections;
        }

        const cutoffDate = subDays(startOfToday(), backupDays);
        return {
            cutoff: cutoffDate,
            collections: collections
        };
    }

}

export interface CleanProcessorOptions {
    cutoff: Date;
    collections: string[];
}
