
import { ICanState, IVehicleState, Geolocation } from 'fancycan-model';
import { MongoClient } from 'mongodb';
import { MongoLayer } from '../core';

export class VehicleRepository {
    private conn: MongoClient;

    public constructor() {
        this.conn = MongoLayer.getInstance().Client;
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

    public buildVehicleMalfuncState(canState: ICanState): any {
        const fcode = 'BYD';
        const state: any = {
            vcode: canState.vcode,
            fcode: fcode,
            spn: canState.spnNo,
            value: canState.value,
            type: 'General',
            CreatedDate: canState.canObjID.getTimestamp(),
        };
        return state;
    }
}
