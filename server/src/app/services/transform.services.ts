import { DataLayer } from '../datalayer';
import { FireLayer } from '../firelayer';
import { ICan } from '../models/ICanData';
import { ICanState } from '../models/ICanState';
import { IJ1939 } from '../models/IJ1939';

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
        return canID.readUInt16BE(1);
    }

    public decodeData(raw: Buffer, definition: IJ1939): number {
        const bytesCount = Math.ceil((definition.Length + definition.StartBit - 1) / 8);
        const bytes = raw.slice(definition.StartByte - 1, definition.StartByte - 1 + bytesCount);

        const parsedValues: number[] = [];
        const firstIdx = bytes.length - 1;
        const lastIdx = 0;
        for (let i = 0; i < bytes.length; i++) {
          let value = 0;
          if (i === firstIdx) { // the first byte
            const firstByte = bytes[firstIdx];
            // tslint:disable-next-line:no-bitwise
            value = firstByte >> (definition.StartBit - 1) & (Math.pow(2, definition.Length) - 1);
          } else if (i === lastIdx) { // the last byte
            const lastByte = bytes[lastIdx];
            const shift = (definition.StartBit + definition.Length - 1) % 8;
            // tslint:disable-next-line:no-bitwise
            value = lastByte & (Math.pow(2, (shift === 0 ? 8 : shift)) - 1);
          } else {
            value = bytes[i];
          }
          parsedValues.push(value);
        }

        const val = Buffer.from(parsedValues).readUIntLE(0, bytesCount);
        return val * definition.Resolution + definition.Offset;
    }
}
