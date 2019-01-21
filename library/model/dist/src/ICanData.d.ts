/// <reference types="node" />
import { ObjectID } from 'bson';
export interface ICan {
    _id: ObjectID;
    rawID: ObjectID;
    delimiter: Buffer;
    canID: Buffer;
    canData: Buffer;
    localPort: number;
    remotePort: number;
}
