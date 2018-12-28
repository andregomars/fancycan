import NodeCache from 'node-cache';

export class CacheLayer {
    public static getInstance() {
        if (!CacheLayer.instance) {
            CacheLayer.instance = new CacheLayer();
        }
        return CacheLayer.instance;
    }

    private static instance: CacheLayer;
    private rootCache: NodeCache;

    private constructor() {
        this.rootCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
    }

    public get<T>(key: string): T | undefined {
        return this.rootCache.get<T>(key);
    }
    public set<T>(key: string, value: T): boolean {
        return this.rootCache.set<T>(key, value);
    }
    public del(key: string) {
        return this.rootCache.del(key);
    }
}
