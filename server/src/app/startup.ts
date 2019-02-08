import { IJ1939, ViewProfileStateModel } from 'fancycan-model';
import { TransformUtility, SpnCache, ViewProfileCache, ConfigUtility, MongoLayer } from 'fancycan-common';

import { FireLayer } from './firelayer';

export class Startup {
    private fire: FireLayer;
    private spnCache: SpnCache;
    private transform: TransformUtility;
    private viewProfileCache: ViewProfileCache;

    constructor() {
        const config = new ConfigUtility();
        this.fire = new FireLayer(config.getFbConnectionString());
        this.spnCache = new SpnCache();
        this.transform = new TransformUtility();
        this.viewProfileCache = new ViewProfileCache();
    }

    public async init() {
        await this.initCacheStorage();
        await this.initDatabaseConnection();
    }

    public async initCacheStorage() {
        const spns = await this.fire.getDefinitionWithSpecs().toPromise<IJ1939[]>();
        this.spnCache.storeSpnsIntoCacheGroupedByPgn(spns);

        const fleets$ = await this.fire.getFleets();
        const flattedVehicles =
            await this.transform.getFlattedVehicles(fleets$).toPromise<ViewProfileStateModel[]>();
        this.viewProfileCache.storeViewProfileIntoCacheGroupedByVehicleCode(flattedVehicles);
    }

    public async initDatabaseConnection() {
        await MongoLayer.getInstance().connect();
    }
}
