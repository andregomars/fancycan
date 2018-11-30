import { ObjectID } from 'bson';

export interface ICan {
    rawID: ObjectID;
    delimiter: Buffer;
    canID: Buffer;
    canData: Buffer;
    localPort: number;
    remotePort: number;
}
