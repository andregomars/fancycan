import config from 'config';
import { IJ1939 } from '../models/IJ1939';
import { CacheLayer } from '../cachelayer';
import { DataLayer } from '../datalayer';
import { TransformService } from './transform.services';
import { ICan } from '../models/ICanData';
import { ICanState } from '../models/ICanState';

export class Utility {
    public getDbConnectionString(): string {
        const host = encodeURIComponent(config.get('dbConfig.host'));
        const port = encodeURIComponent(config.get('dbConfig.port'));
        const user = encodeURIComponent(config.get('dbConfig.user'));
        const password = encodeURIComponent(config.get('dbConfig.password'));
        const authMechanism = config.get('dbConfig.auth');
        // e.g. 'mongodb://127.0.0.1:27017';
        const url =
            `mongodb://${user}:${password}@${host}:${port}/?authMechanism=${authMechanism}`;

        return url;
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

    public getFbConnectionString(): string {
        return config.get('fbConfig.url');
    }

    public getTopicName(name: string = 'default'): string {
        const defaultTopic = 'tCan';
        return config.get(`mqConfig.topics.${name}`) || defaultTopic;
    }

    public storeSpnsIntoCacheGroupedByPgn(spns: IJ1939[]) {
        const cache = CacheLayer.getInstance();
        let key = '';
        for (const spn of spns) {
            key = this.buildPgnKey(spn.PGNNo);
            const pgn = cache.get<IJ1939[]>(key);
            if (pgn && pgn.length > 0) {
                pgn.push(spn);
                cache.set<IJ1939[]>(key, pgn);
            } else {
                cache.set<IJ1939[]>(key, [spn]);
            }
        }
    }

    public retrieveSpnsByPgnFromCache(pgnNo: number): IJ1939[] | undefined {
        const key = this.buildPgnKey(pgnNo);
        return CacheLayer.getInstance().get<IJ1939[]>(key);
    }

    public async saveCanDocs(docs: ICan[], dbo: DataLayer, transformService: TransformService) {
        dbo.insertCans(docs);
        const states = transformService.getCanStates(docs);
        await dbo.insertCanStates(states);
        for (const canState of states) {
            await this.saveVehicleStateDoc(canState, dbo, transformService);
        }
    }

    public async saveCanDoc(doc: ICan, dbo: DataLayer, transformService: TransformService) {
        dbo.insertCan(doc);
        const states = transformService.getCanState(doc);
        await dbo.insertCanStates(states);
        for (const canState of states) {
            await this.saveVehicleStateDoc(canState, dbo, transformService);
        }
    }

    public async saveVehicleStateDoc(canState: ICanState, dbo: DataLayer, transofrmService: TransformService) {
        const state = transofrmService.buildVehicleState(canState);
        await dbo.upsertVehicleState(state);
    }

    private buildPgnKey(pgnNo: number) {
        return `pgn_${pgnNo}`;
    }

}
