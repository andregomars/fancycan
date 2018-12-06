import config from 'config';

export class Utility {
    public greeting(name: string): string {
        return `Hello, your ${name.toUpperCase()}!`;
    }

    public getConnectionString(): string {
        const host = encodeURIComponent(config.get('dbConfig.host'));
        const port = encodeURIComponent(config.get('dbConfig.port'));
        const user = encodeURIComponent(config.get('dbConfig.user'));
        const password = encodeURIComponent(config.get('dbConfig.password'));
        const authMechanism = config.get('dbConfig.auth');
        // const url = 'mongodb://127.0.0.1:27017';
        const url =
            `mongodb://${user}:${password}@${host}:${port}/?authMechanism=${authMechanism}`;

        return url;
    }
}
