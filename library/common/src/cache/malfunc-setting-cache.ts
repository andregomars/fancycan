import CacheLayer from 'fancycan-cache';

export class MalfuncSettingCache {

    public storeMalfuncSettingIntoCache(malfuncSettings: any[]) {
        const cache = CacheLayer.getInstance();

        for (const setting of malfuncSettings) {
            cache.set<any>(this.buildMalfuncSettingKey(setting.id), setting);
        }
    }

    public retrieveMalfuncSettingFromCache(vcode: string): any {
        const key = this.buildMalfuncSettingKey(vcode);
        return CacheLayer.getInstance().get<any>(key);
    }

    private buildMalfuncSettingKey(vcode: string) {
        return `malfunc_setting_${vcode}`;
    }
}
