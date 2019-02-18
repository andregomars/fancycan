import { IUser } from 'fancycan-model';
import { GeneralCache } from '../cache';
import { EmailLayer } from '../core';

export class UserRepository {
    private NOTIFY_EMAIL = 'email';

    public getUsers(): IUser[] {
        return GeneralCache.retrieveUsers();
    }

    public async notifyUsers(subject: string, html: string, notifyOptions: string[]) {
        const users = this.getUsers();
        if (!users || users.length < 1) {
            return;
        }

        for (const user of users) {
            // user subscribes email and notify options contains email
            if (user.notification && user.notification.indexOf(this.NOTIFY_EMAIL) > -1 &&
                notifyOptions && notifyOptions.indexOf(this.NOTIFY_EMAIL) > -1) {
                await EmailLayer.send(user.email, subject, html);
            }
        }

    }

}
