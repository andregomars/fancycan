import { Injectable } from '@angular/core';
import { Buffer } from 'buffer/';
import { ICanEntry, Dm1EntryType, Dm1Collection } from 'fancycan-model';
import { TransformService } from './transform.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Dm1AlertService {
  // private _listDm1Single = [];
  // private _listDm1Multiple = [];
  private _listDm1Collection: Dm1Collection;
  private _listDm1SingleRaw: ICanEntry[] = [];
  private _listDm1MultipleRaw: ICanEntry[] = [];

  get listDm1Collection(): Dm1Collection {
    return this._listDm1Collection;
  }
  get listDm1SingleRaw(): ICanEntry[] {
    return this._listDm1SingleRaw;
  }
  get listDm1MultipleRaw(): ICanEntry[] {
    return this._listDm1MultipleRaw;
  }

  constructor(
    private transformService: TransformService
  ) {
    this.initDm1Collection();
  }

  push(entry: ICanEntry) {
    switch (this.getDm1EntryType(entry.key.toUpperCase())) {
      case Dm1EntryType.Single:
        this._listDm1SingleRaw.pop();
        this._listDm1SingleRaw.push(entry);
        this._listDm1Collection = this.transformService.decodeDm1(entry.value, Dm1EntryType.Single, this._listDm1Collection);
        break;
      case Dm1EntryType.MultiHeader:
        this._listDm1MultipleRaw.length = 0;
        this._listDm1MultipleRaw.push(entry);
        this._listDm1Collection = this.transformService.decodeDm1(entry.value, Dm1EntryType.MultiHeader, this._listDm1Collection);
        break;
      case Dm1EntryType.MultiData:
        this._listDm1MultipleRaw.push(entry);
        this._listDm1Collection = this.transformService.decodeDm1(entry.value, Dm1EntryType.MultiData, this._listDm1Collection);
        break;
    }
  }

  private initDm1Collection() {
    this._listDm1Collection = {
      lamp: 0,
      packetsCount: 0,
      entriesCount: 0,
      entriesBuffer: Buffer.alloc(0),
      data: []
    };
  }

  private getDm1EntryType(key: string): Dm1EntryType {
    if (environment.dm1SingleCanIDs.indexOf(key) > -1) {
      return Dm1EntryType.Single;
    } else if (environment.dm1MultipleCanIDs.header.indexOf(key) > -1) {
      return Dm1EntryType.MultiHeader;
    } else if (environment.dm1MultipleCanIDs.data.indexOf(key) > -1) {
      return Dm1EntryType.MultiData;
    }
  }
}
