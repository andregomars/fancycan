import { ObjectID } from 'bson';
import { Buffer } from 'buffer/';

import { ICan, ICanRaw } from 'fancycan-model';

export class DocService {
    public buildCan(buffer: Buffer, rawID: ObjectID, localPort: number, remotePort: number): ICan {
        return {
            _id: new ObjectID(),
            rawID: rawID,
            delimiter: buffer.slice(0, 1),
            canID: buffer.slice(1, 5),
            canData: buffer.slice(-8),
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
