import { Startup } from './startup';
import { ProcessorManager } from './processors/processor-manager';

export class Application {
    public async start() {
        console.log('job starts @ ' + new Date());
        await new Startup().init();

        const procManager = new ProcessorManager();
        await procManager.run();
    }
}
