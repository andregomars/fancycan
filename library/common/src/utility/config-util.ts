import config from 'config';

export class ConfigUtility {
    public getDbConnectionString(): string {
        const scheme = config.get('dbConfig.scheme');
        const host = encodeURIComponent(config.get('dbConfig.host'));
        const user = encodeURIComponent(config.get('dbConfig.user'));
        const password = encodeURIComponent(config.get('dbConfig.password'));
        // const port = encodeURIComponent(config.get('dbConfig.port'));
        // const authMechanism = config.get('dbConfig.auth');
        const url =
            // `${scheme}://${user}:${password}@${host}:${port}/?authMechanism=${authMechanism}`;
            `${scheme}://${user}:${password}@${host}`;

        return url;
    }

    public getFbConnectionString(): string {
        return config.get('fbConfig.url');
    }

    public getMqConnectionString(): string {
        const host = encodeURIComponent(config.get('mqConfig.host'));
        const scheme = encodeURIComponent(config.get('mqConfig.scheme'));
        const port = encodeURIComponent(config.get('mqConfig.port'));
        // e.g. 'mqtt://127.0.0.1:1833', 'ws://127.0.0.1:9001'
        const url =
            `${scheme}://${host}:${port}`;

        return url;
    }

    public getCommonConfig(key: string): string {
        return config.get(`common.${key}`);
    }

    public getTopicName(name: string = 'default'): string {
        const defaultTopic = 'tCan';
        return config.get(`mqConfig.topics.${name}`) || defaultTopic;
    }
}
