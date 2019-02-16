
import { ICanState, IVehicleState, Geolocation,
    IRuleEvent, IRuleEventParams, IVehicleMalfuction } from 'fancycan-model';
import { ViewProfileCache } from '../cache';
import { MongoClient } from 'mongodb';
import { MongoLayer } from '../core';

export class VehicleRepository {
    private conn: MongoClient;
    private viewProfileCache: ViewProfileCache;

    public constructor() {
        this.conn = MongoLayer.getInstance().Client;
        this.viewProfileCache = new ViewProfileCache();
    }

    public async upsertVehicleState(state: IVehicleState) {
        await this.conn.db('main').collection('vehicle_state').updateOne(
            { vcode: state.vcode },
            {
                $currentDate: { editDate: true },
                $set: state,
                $setOnInsert: { createDate: new Date() },
            },
            { upsert: true },
        );
    }

    public async insertVehicleMalfuncState(state: any) {
        await this.conn.db('main').collection('vehicle_malfunc_state').insertOne(state);
    }

    public async getVehicleStates(): Promise<IVehicleState[]> {
        return await this.conn.db('main').collection('vehicle_state').find<IVehicleState>().toArray();
    }

    public buildVehicleMalfuncState(vState: IVehicleState, ruleEvent: IRuleEvent): any {
        const malfuncInfo = {
            malfuncID: ruleEvent.params.id,
            malfuncName: ruleEvent.params.name,
            malfuncLevel: ruleEvent.params.level,
        };
        const mState: IVehicleMalfuction = Object.assign({}, vState, malfuncInfo);
        return mState;
    }

    public buildVehicleState(canState: ICanState): IVehicleState | undefined {
        const geolocations: Geolocation[] = [
            { latitude: 34.057539, longitude: -118.237494 },
            { latitude: 34.056544, longitude: -118.238082 },
            { latitude: 34.055955, longitude: -118.238996 },
            { latitude: 34.056325, longitude: -118.239507 },
        ];
        const viewProfile = this.viewProfileCache.retrieveViewProfileByVehicleCodeFromCache(canState.vcode);
        if (!viewProfile) {
            return undefined;
        }

        const state: IVehicleState = {
            vcode: canState.vcode,
            vin: viewProfile.vin,
            fcode: viewProfile.fcode,
            fname: viewProfile.fname,
            geolocations: geolocations,
        };
        state['spn' + canState.spnNo] = canState.value;
        return state;
    }
}
