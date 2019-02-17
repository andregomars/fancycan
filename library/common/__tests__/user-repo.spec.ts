import { UserRepository } from '../src/repository';
import { GeneralCache } from '../src/cache';
import { FireLayer } from '../src/core';

describe('When test user repo', () => {

    it('should get all users from firebase', async () => {
        const fire = new FireLayer();
        const users = await fire.getUsers().toPromise();
        GeneralCache.storeUsers(users);

        const userRepo = new UserRepository();
        const actual = userRepo.getUsers();
        expect(actual).toBeTruthy();
        expect(actual.length).toBeGreaterThan(0);
        expect(actual.some((user) => user.name === 'andre')).toBeTruthy();
    });
});
