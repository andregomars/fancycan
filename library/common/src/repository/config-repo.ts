import config from 'config';

export class ConfigRepository {
    public getDbConnectionString(): string {
        const host = encodeURIComponent(config.get('dbConfig.host'));
        const port = encodeURIComponent(config.get('dbConfig.port'));
        const user = encodeURIComponent(config.get('dbConfig.user'));
        const password = encodeURIComponent(config.get('dbConfig.password'));
        const authMechanism = config.get('dbConfig.auth');
        const url =
            `mongodb://${user}:${password}@${host}:${port}/?authMechanism=${authMechanism}`;

        return url;
    }

    public getFbConnectionString(): string {
        return config.get('fbConfig.url');
    }
}
