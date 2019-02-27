import { Injectable } from '@angular/core';
import { Buffer } from 'buffer/';
import { TransformUtility } from 'fancycan-utility';
import { IJ1939, Dm1EntryType, Dm1Collection, ViewProfileStateModel } from 'fancycan-model';

@Injectable({
  providedIn: 'root'
})
export class TransformService {
  private transform: TransformUtility;

  constructor() {
    this.transform = new TransformUtility();
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

  decodeDm1(canData: string, entryType: Dm1EntryType, dm1Collection: Dm1Collection): Dm1Collection {
    return this.transform.decodeDm1(canData, entryType, dm1Collection);
  }

  getViewProfileByVehicleCode(vcode: string, fleets: any[]): ViewProfileStateModel {
    return this.transform.getViewProfileByVehicleCode(vcode, fleets);
  }

  getViewProfileByFleetCode(fcode: string, fleets: any[]): any[] {
    return this.transform.getViewProfileByFleetCode(fcode, fleets);
  }

}
