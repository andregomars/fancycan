import CacheLayer from 'fancycan-cache';
import { ViewProfileStateModel } from 'fancycan-model';

export class ViewProfileRepository {

    public storeViewProfileIntoCacheGroupedByVehicleCode(viewProfiles: ViewProfileStateModel[]) {
        const cache = CacheLayer.getInstance();

        for (const vehicle of viewProfiles) {
            cache.set<any>(this.buildViewProfileKey(vehicle.vcode), vehicle);
        }
    }

    public retrieveViewProfileByVehicleCodeFromCache(vcode: string): ViewProfileStateModel | undefined {
        const key = this.buildViewProfileKey(vcode);
        return CacheLayer.getInstance().get<ViewProfileStateModel>(key);
    }

    private buildViewProfileKey(vcode: string) {
        return `vcode_${vcode}`;
    }
}
