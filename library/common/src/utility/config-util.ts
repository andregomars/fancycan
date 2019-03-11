import config from 'config';
import { IJobProcessor } from 'fancycan-model';

export class ConfigUtility {
    public static getEmailApiKey(): string {
        return config.get('email.apiKey');
    }

    public static getEmailFrom(): string {
        return config.get('email.from');
    }

    public static getDbConnectionString(): string {
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

    public static getFbConnectionString(): string {
        return config.get('fbConfig.url');
    }

    public static getMqConnectionString(): string {
        const host = encodeURIComponent(config.get('mqConfig.host'));
        const scheme = encodeURIComponent(config.get('mqConfig.scheme'));
        const port = encodeURIComponent(config.get('mqConfig.port'));
        // e.g. 'mqtt://127.0.0.1:1833', 'ws://127.0.0.1:9001'
        const url =
            `${scheme}://${host}:${port}`;

        return url;
    }

    public static getCommonConfig(key: string): string {
        return config.get(`common.${key}`);
    }

    public static getTopicName(name: string = 'default'): string {
        const defaultTopic = 'tCan';
        return config.get(`mqConfig.topics.${name}`) || defaultTopic;
    }

    public static getJobProcessors(): IJobProcessor[] {
        return config.get<IJobProcessor[]>('jobProcessors');
    }
}
