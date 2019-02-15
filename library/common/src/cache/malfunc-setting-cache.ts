import CacheLayer from 'fancycan-cache';

export class MalfuncSettingCache {
    private MFS_KEY = 'malfunctionSettings';

    public storeMalfuncSettingIntoCache(malfuncSettings: any[]) {
        const cache = CacheLayer.getInstance();
        cache.set<any>(this.MFS_KEY, malfuncSettings);
    }

    public retrieveMalfuncSettingFromCache(): any {
        return CacheLayer.getInstance().get<any>(this.MFS_KEY);
    }

    public storeMalfuncSettingIntoCacheByID(malfuncSettings: any[]) {
        const cache = CacheLayer.getInstance();

        for (const setting of malfuncSettings) {
            cache.set<any>(this.buildMalfuncSettingKey(setting.id), setting);
        }
    }

    public retrieveMalfuncSettingFromCacheByID(id: number): any {
        const key = this.buildMalfuncSettingKey(id);
        return CacheLayer.getInstance().get<any>(key);
    }

    private buildMalfuncSettingKey(id: number) {
        return `malfunc_setting_${id}`;
    }
}
