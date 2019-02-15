import { MalfuncProceccor } from './malfunc-processor';
import { Startup } from './startup';

export class Application {
    public async start() {
        console.log('job starts @ ' + new Date());
        await new Startup().init();

        const malfunc = new MalfuncProceccor();
        await malfunc.run();
    }
}
