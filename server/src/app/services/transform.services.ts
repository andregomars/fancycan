import { DataLayer } from '../datalayer';
import { FireLayer } from '../firelayer';
import { ICan } from '../models/ICanData';
import { ICanState } from '../models/ICanState';

export class TransformService {
    private dataLayer: DataLayer;
    private fireLayer: FireLayer;
    constructor(dataLayer: DataLayer, fireLayer: FireLayer) {
        this.dataLayer = dataLayer;
        this.fireLayer = fireLayer;
    }

    public importCanStates(cans: ICan[]) {
        console.log('import CAN state...');
        this.fireLayer.getDefinitions().subscribe((resp: any) =>
            console.log(resp));
    }

    // public trans(can: ICan): ICanState {
    //     const data = can.canData;
    //     return null;
    // }

    public decodePGN(canID: Buffer): number {
        return 2;
    }
}
