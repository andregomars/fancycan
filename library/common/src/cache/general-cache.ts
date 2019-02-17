import CacheLayer from 'fancycan-cache';
import { IUser } from 'fancycan-model';

export class GeneralCache {
    private static KEY_USERS = 'users';

    public static storeUsers(users: IUser[]) {
        const cache = CacheLayer.getInstance();
        cache.set<IUser[]>(this.KEY_USERS, users);
    }

    public static retrieveUsers(): IUser[] {
        return CacheLayer.getInstance().get<IUser[]>(this.KEY_USERS)!;
    }
}
