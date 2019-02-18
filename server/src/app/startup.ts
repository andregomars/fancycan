import { IJ1939, ViewProfileStateModel } from 'fancycan-model';
import { TransformUtility, SpnCache, ViewProfileCache,
    MongoLayer, FireLayer } from 'fancycan-common';

export class Startup {
    private fire: FireLayer;
    private spnCache: SpnCache;
    private transform: TransformUtility;
    private viewProfileCache: ViewProfileCache;

    constructor() {
        this.fire = new FireLayer();
        this.spnCache = new SpnCache();
        this.transform = new TransformUtility();
        this.viewProfileCache = new ViewProfileCache();
    }

    public async init() {
        await this.initCacheStorage();
        await this.initDatabaseConnection();
    }

    private async initCacheStorage() {
        const spns = await this.fire.getDefinitionWithSpecs().toPromise<IJ1939[]>();
        this.spnCache.storeSpnsIntoCacheGroupedByPgn(spns);

        const fleets$ = await this.fire.getFleets();
        const flattedVehicles =
            await this.transform.getFlattedVehicles(fleets$).toPromise<ViewProfileStateModel[]>();
        this.viewProfileCache.storeViewProfileIntoCacheGroupedByVehicleCode(flattedVehicles);
    }

    private async initDatabaseConnection() {
        await MongoLayer.getInstance().connect();
    }
}
