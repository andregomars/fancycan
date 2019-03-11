import { MalfuncProcessor } from './malfunc-processor';
import { Startup } from './startup';
import { CleanProcessor } from './clean-processor';

export class Application {
    public async start() {
        console.log('job starts @ ' + new Date());
        await new Startup().init();

        const malfunc = new MalfuncProcessor();
        const clean = new CleanProcessor();

        await malfunc.run();
        await clean.run();
    }
}
