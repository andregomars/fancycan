import { ObjectID } from 'bson';
import { Buffer } from 'buffer/';

export interface ICan {
    _id: ObjectID;
    rawID: ObjectID;
    delimiter: Buffer;
    canID: Buffer;
    canData: Buffer;
    localPort: number;
    remotePort: number;
}
