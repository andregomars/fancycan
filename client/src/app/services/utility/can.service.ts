import { Injectable } from '@angular/core';
import { Buffer } from 'buffer/';
import { Dm1EntryType } from '../../models/dm1-entry-type';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CanService {

  constructor() { }

  decodeJ1939(raw: Buffer, startBit: number, length: number): number {
    const definition = {
      StartByte: Math.ceil(startBit / 8),
      StartBit: startBit % 8 === 0 ? 8 : startBit % 8,
      Length: length
    };

    /*** same as server transform ***/
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

    return Buffer.from(parsedValues).readUIntLE(0, bytesCount);
  }

  decodeDm1(canData: string, entryType: Dm1EntryType, dm1Collection: Dm1Collection): Dm1Collection {
    const buffer = Buffer.from(canData, 'hex');
    if (entryType === Dm1EntryType.Single) {
      return this.decodeDm1Single(buffer);
    } else {
      return this.decodeDm1Mutiple(buffer, dm1Collection, entryType);
    }
  }

  private decodeDm1Single(buffer: Buffer): Dm1Collection {
    const data = this.buildDm1DataFromBuffer(buffer.slice(2, 6));

    const collection: Dm1Collection = {
      lamp: buffer[0],
      packetsCount: 1,
      entriesCount: 1,
      entriesBuffer: buffer,
      data: [data]
    };

    return collection;
  }

  private buildDm1DataFromBuffer(buffer: Buffer): Dm1Data {
    return {
      spn: buffer.readUInt16LE(0),
      fmi: buffer[2],
      count: buffer[3]
    } as Dm1Data;
  }

  private decodeDm1Mutiple(buffer: Buffer, dm1Collection: Dm1Collection, entryType: Dm1EntryType): Dm1Collection {
    // header
    if (entryType === Dm1EntryType.MultiHeader) {
      dm1Collection.packetsCount = (buffer[1] - 2) / 4;
      dm1Collection.entriesCount = Math.ceil(buffer[1] / 7);
    } else {
      // data
      const concatedLength = dm1Collection.entriesBuffer.length + 7;
      dm1Collection.entriesBuffer = Buffer.concat([dm1Collection.entriesBuffer, buffer.slice(1, 8)], concatedLength);
      const collectionID = buffer[0];

      // after the last data entry, wrap up the whole collection
      if (collectionID === dm1Collection.entriesCount) {
        dm1Collection = this.wrapUpDm1DataCollection(dm1Collection);
      }
    }

    return dm1Collection;
  }

  private wrapUpDm1DataCollection(dm1Collection: Dm1Collection): Dm1Collection {
    dm1Collection.lamp = dm1Collection.entriesBuffer[0];
    const bytesCount = dm1Collection.packetsCount * 4 + 2;
    const dataBuffer = dm1Collection.entriesBuffer.slice(2, bytesCount);
    const buffers = _.chunk<number>(dataBuffer, 4);
    dm1Collection.data = buffers.map((val: number[]) => this.buildDm1DataFromBuffer(Buffer.from(val)) );
    return dm1Collection;
  }
}

export interface Dm1Data {
  spn: number;
  fmi: number;
  count: number;
}

export interface Dm1Collection {
  lamp: number;
  packetsCount: number;  // count of 4 bytes data, e.g. 0x64 0x00 0x01 0x01
  entriesCount: number;  // count of can data entries
  entriesBuffer: Buffer;  // can data entries
  data: Dm1Data[];
}
