import { IJ1939, ViewProfileStateModel } from 'fancycan-model';
import { TransformUtility } from 'fancycan-utility';
import { SpnCache, ViewProfileCache,
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
        const defs = await this.fire.getDefinitions().toPromise();
        const spnsProp = await this.fire.getProprietarySpnList().toPromise();
        const spnsJ1939 = await this.fire.getJ1939SpnList().toPromise();
        const spns = this.transform.getDefinitionWithSpecs(defs, spnsProp, spnsJ1939);
        this.spnCache.storeSpnsIntoCacheGroupedByPgn(spns);

        const fleets = await this.fire.getFleets().toPromise();
        const flattedVehicles: ViewProfileStateModel[] = await this.transform.getFlattedVehicles(fleets);
        this.viewProfileCache.storeViewProfileIntoCacheGroupedByVehicleCode(flattedVehicles);
    }

    private async initDatabaseConnection() {
        await MongoLayer.getInstance().connect();
    }
}
