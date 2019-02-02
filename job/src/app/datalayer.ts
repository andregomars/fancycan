import { MongoClient } from 'mongodb';
import { IVehicleState } from 'fancycan-model';

export class DataLayer {
    private conn: MongoClient;

    constructor(client: MongoClient) {
        this.conn = client;
    }

    public async getVehicleStates(): Promise<IVehicleState[]> {
        return await this.conn.db('main').collection('vehicle_state').find<IVehicleState>().toArray();
    }

}
