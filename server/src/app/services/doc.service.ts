import { ObjectID } from 'bson';

import { ICan } from '../models/ICanData';
import { ICanRaw } from '../models/ICanRaw';

export class DocService {
    public buildCan(buffer: Buffer, rawID: ObjectID, localPort: number, remotePort: number): ICan {
        return {
            rawID: rawID,
            delimiter: Buffer.from('88', 'hex'),
            canID: Buffer.from('00', 'hex'),
            canData: Buffer.from('00', 'hex'),
            localPort: localPort,
            remotePort: remotePort,
        };
    }

    public buildCanRaw(buffer: Buffer): ICanRaw {
        return {
            raw: buffer,
        };
    }
}
