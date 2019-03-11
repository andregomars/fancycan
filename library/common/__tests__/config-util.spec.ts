import { ConfigUtility } from '../src/utility';
import { IJobProcessor } from 'fancycan-model';

describe('When test MongoLayer', () => {
    it('should able to connect test mongodb', () => {
        const actual = ConfigUtility.getDbConnectionString();
        const expected = 'mongodb+srv://admin:fccdbo123!@cluster0-pwbs7.mongodb.net';

        expect(actual).toEqual(expected);
    });

    it('should get processors from config', () => {
        const processors: IJobProcessor[] = ConfigUtility.getJobProcessors();
        const proc = processors.find((x) => x.name === 'CleanProcessor');

        expect(processors.length).toBeGreaterThan(0);
        expect(proc).toBeTruthy();
        expect(proc!.backupDays).toBeGreaterThan(1);

    });

});
