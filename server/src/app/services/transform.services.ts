import _ from 'lodash';
import { ICan } from '../models/ICanData';
import { ICanState } from '../models/ICanState';
import { IJ1939 } from '../models/IJ1939';
import { Utility } from './utility';
import { IVehicleState } from '../../../../library/src';

export class TransformService {
    private utility: Utility;

    constructor() {
        this.utility = new Utility();
    }

    public getCanStates(cans: ICan[]): ICanState[] {
        return cans.map((can: ICan) => this.getCanState(can)).reduce((pre, cur) => [...pre, ...cur]);
    }

    public getCanState(can: ICan): ICanState[] {
        const pgnID = this.decodePGN(can.canID);
        const spns = this.utility.retrieveSpnsByPgnFromCache(pgnID);

        if (!spns) {
            return [];
        }

        const canStates = new Array<ICanState>();
        for (const spn of spns!) {
            const val = this.decodeData(can.canData, spn);
            const state: ICanState = {
                canObjID: can._id,
                vcode: '6001',
                code: spn.Code,
                spnNo: spn.SPNNo,
                spnName: spn.SPNName,
                pgnNo: pgnID,
                pgnName: spn.PGNName,
                value: val,
                unit: spn.Unit,
                min: spn.LowerDataRange,
                max: spn.UpperDataRange,
            };
            canStates.push(state);
        }

        return canStates;
    }

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
        return _.round(val * definition.Resolution + definition.Offset, 4);
    }

    public buildVehicleState(canState: ICanState): any {
        const state: any = { vcode: canState.vcode };
        state[canState.code] = canState.value;
        return state;
    }
}
