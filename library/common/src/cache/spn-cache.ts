import { IJ1939, ICan } from 'fancycan-model';
import CacheLayer from 'fancycan-cache';
import { TransformUtility } from 'fancycan-utility';

export class SpnCache {
    private transform: TransformUtility;

    constructor() {
        this.transform = new TransformUtility();
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

    public retrieveSpnsByCanFromCache(can: ICan): IJ1939[] | undefined {
        const pgnID = this.transform.decodePGN(can.canID);
        return this.retrieveSpnsByPgnFromCache(pgnID);
    }

    private buildPgnKey(pgnNo: number) {
        return `pgn_${pgnNo}`;
    }
}
