import { Buffer } from 'buffer/';
import { Dm1Data } from './dm1-data';

export interface Dm1Collection {
    lamp: number;
    packetsCount: number;  // count of 4 bytes data, e.g. 0x64 0x00 0x01 0x01
    entriesCount: number;  // count of can data entries
    entriesBuffer: Buffer;  // can data entries
    data: Dm1Data[];
}
