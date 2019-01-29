import config from 'config';
import { ICan, ICanState, IJ1939, ViewProfileStateModel } from 'fancycan-model';
import { Transform, SpnRepository, ViewProfileRepository } from 'fancycan-common';

import { DataLayer } from '../datalayer';
import { FireLayer } from '../firelayer';

export class Utility {
    private fire: FireLayer;
    private spnRepo: SpnRepository;
    private transform: Transform;
    private viewProfileRepo: ViewProfileRepository;

    constructor() {
        this.fire = new FireLayer(this.getFbConnectionString());
        this.spnRepo = new SpnRepository();
        this.transform = new Transform();
        this.viewProfileRepo = new ViewProfileRepository();
    }

    public async initCacheStorage() {
        const spns = await this.fire.getDefinitionWithSpecs().toPromise<IJ1939[]>();
        this.spnRepo.storeSpnsIntoCacheGroupedByPgn(spns);

        const fleets$ = await this.fire.getFleets();
        const flattedViehcles =
            await this.transform.getFlattedVehicles(fleets$).toPromise<ViewProfileStateModel[]>();
        this.viewProfileRepo.storeViewProfileIntoCacheGroupedByVehicleCode(flattedViehcles);
    }

    public getDbConnectionString(): string {
        const host = encodeURIComponent(config.get('dbConfig.host'));
        const port = encodeURIComponent(config.get('dbConfig.port'));
        const user = encodeURIComponent(config.get('dbConfig.user'));
        const password = encodeURIComponent(config.get('dbConfig.password'));
        const authMechanism = config.get('dbConfig.auth');
        // e.g. 'mongodb://127.0.0.1:27017';
        const url =
            `mongodb://${user}:${password}@${host}:${port}/?authMechanism=${authMechanism}`;

        return url;
    }

    public getMqConnectionString(): string {
        const host = encodeURIComponent(config.get('mqConfig.host'));
        const scheme = encodeURIComponent(config.get('mqConfig.scheme'));
        const port = encodeURIComponent(config.get('mqConfig.port'));
        // e.g. 'mqtt://127.0.0.1:1833', 'ws://127.0.0.1:9001'
        const url =
            `${scheme}://${host}:${port}`;

        return url;
    }

    public getCommonConfig(key: string): string {
        return config.get(`common.${key}`);
    }

    public getFbConnectionString(): string {
        return config.get('fbConfig.url');
    }

    public getTopicName(name: string = 'default'): string {
        const defaultTopic = 'tCan';
        return config.get(`mqConfig.topics.${name}`) || defaultTopic;
    }

    public async saveCanDoc(doc: ICan, dbo: DataLayer, transform: Transform) {
        await dbo.insertCan(doc);
        const states = transform.buildCanState(doc);
        if (states.length > 0) {
            await dbo.insertCanStates(states);
            for (const canState of states) {
                await this.saveVehicleStateDoc(canState, dbo);
                await this.saveVehicleMalfuncStateDoc(canState, dbo);
            }
        }
    }

    public async saveVehicleStateDoc(canState: ICanState, dbo: DataLayer) {
        const state = this.transform.buildVehicleState(canState);
        if (!state) {
            console.log(`vehicle state build failed for vcode : ${canState.vcode} & can objID: ${canState.vcode}`);
            return;
        }
        await dbo.upsertVehicleState(state);
    }

    public async saveVehicleMalfuncStateDoc(canState: ICanState, dbo: DataLayer) {
        if (canState.spnNo === 190 && canState.value > 800) {
            const state = this.transform.buildVehicleMalfuncState(canState);
            await dbo.insertVehicleMalfuncState(state);
        }
    }

}
