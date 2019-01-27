import { Injectable } from '@angular/core';
import { Buffer } from 'buffer/';
import { Transform } from 'fancycan-common';
import { ICan, ICanState, IJ1939, Dm1EntryType, Dm1Collection } from 'fancycan-model';

@Injectable({
  providedIn: 'root'
})
export class TransformService {
  private transform: Transform;

  constructor() {
    this.transform = new Transform();
  }

  buildCanStates(cans: ICan[]): ICanState[] {
    return this.transform.buildCanStates(cans);
  }

  buildCanState(can: ICan): ICanState[] {
    return this.transform.buildCanState(can);
  }

  decodePGN(canID: Buffer): number {
    return this.transform.decodePGN(canID);
  }

  decodeJ1939(rawHex: string, startBit: number, length: number): number {
    return this.transform.decodeJ1939(rawHex, startBit, length);
  }

  decodeData(raw: Buffer, definition: IJ1939): number {
    return this.transform.decodeData(raw, definition);
  }

  buildVehicleState(canState: ICanState): any {
    return this.transform.buildVehicleState(canState);
  }

  buildVehicleMalfuncState(canState: ICanState): any {
    return this.transform.buildVehicleMalfuncState(canState);
  }

  decodeDm1(canData: string, entryType: Dm1EntryType, dm1Collection: Dm1Collection): Dm1Collection {
    return this.transform.decodeDm1(canData, entryType, dm1Collection);
  }
}
