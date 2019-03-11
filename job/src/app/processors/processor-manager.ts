import { MalfuncProcessor } from './malfunc-processor';
import { CleanProcessor } from './clean-processor';
import { ConfigUtility } from 'fancycan-common';

export class ProcessorManager {

    public async run() {
        const procs = ConfigUtility.getJobProcessors();
        for (const proc of procs) {
            if (proc.enabled) {
                switch (proc.name) {
                    case MalfuncProcessor.name:
                        await new MalfuncProcessor().run();
                        break;
                    case CleanProcessor.name:
                        await new CleanProcessor().run();
                        break;
                    default:
                        break;
                }
            } else {
                console.log(`Processor ${proc.name} is disabled.`);
            }
        }
    }

}
