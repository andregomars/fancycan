import { Injectable } from '@angular/core';
import { ICanEntry } from '../../models';
import { environment } from '../../../environments/environment';
import { CanService } from './can.service';
import { Dm1EntryType } from '../../models/dm1-entry-type';

@Injectable({
  providedIn: 'root'
})
export class Dm1AlertService {
  private _listDm1Single = [];
  private _listDm1Multiple = [];
  private _listDm1SingleRaw: ICanEntry[] = [];
  private _listDm1MultipleRaw: ICanEntry[] = [];

  constructor(
    private canService: CanService
  ) {
  }

  push(entry: ICanEntry) {
    switch (this.getDm1EntryType(entry.key)) {
      case Dm1EntryType.Single:
        this._listDm1SingleRaw.pop();
        this._listDm1SingleRaw.push(entry);
        break;
      case Dm1EntryType.MultiHeader:
        this._listDm1MultipleRaw.length = 0;
        this._listDm1MultipleRaw.push(entry);
        break;
      case Dm1EntryType.MultiData:
        this._listDm1MultipleRaw.push(entry);
        break;
    }
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
