import { MalfuncSettingCache, FireLayer, MongoLayer, GeneralCache } from 'fancycan-common';
import { IUser } from 'fancycan-model';

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

        const users = await this.fire.getUsers().toPromise<IUser[]>();
        GeneralCache.storeUsers(users);
    }

    public async initDatabaseConnection() {
        await MongoLayer.getInstance().connect();
    }
}
