import { MalfuncSettingCache, FireLayer, MongoLayer } from 'fancycan-common';

export class Startup {
    private fire: FireLayer;
    private malfuncSettingCache: MalfuncSettingCache;

    constructor() {
        this.fire = new FireLayer();
        this.malfuncSettingCache = new MalfuncSettingCache();
    }

    public async init() {
        await this.initCacheStorage();
        await this.initDatabaseConnection();
    }

    public async initCacheStorage() {
        const settings = await this.fire.getMalfunctionSetting().toPromise<any[]>();
        this.malfuncSettingCache.storeMalfuncSettingIntoCache(settings);

    }

    public async initDatabaseConnection() {
        await MongoLayer.getInstance().connect();
    }
}
