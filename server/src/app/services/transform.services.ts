import { DataLayer } from '../datalayer';
import { FireLayer } from '../firelayer';
import { ICan } from '../models/ICanData';

export class TransformService {
    private dataLayer: DataLayer;
    private fireLayer: FireLayer;
    constructor(dataLayer: DataLayer, fireLayer: FireLayer) {
        this.dataLayer = dataLayer;
        this.fireLayer = fireLayer;
    }

    public importCanStates(cans: ICan[]) {
        console.log('import CAN state...');
        this.fireLayer.getDefinitions().subscribe((defs: any) => console.log(defs.body));
    }
}
