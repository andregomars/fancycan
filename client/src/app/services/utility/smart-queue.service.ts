import { Injectable } from '@angular/core';
import { differenceInSeconds } from 'date-fns';
import { Buffer } from 'buffer/';
import * as _ from 'lodash';
import { CanService } from './can.service';
import { ICanEntry } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class SmartQueueService {
  private _queue: ICanEntry[];
  private _min: number;
  private _max: number;
  private _timer: number;
  private _times: number;
  private _timerStartAt: Date;

  private _filterKey: string;
  private filterValueStartBit: number;
  private filterValueLength: number;

  get queue() {
    return _.sortBy(this._queue, ['key']);
  }

  get min() {
    return this._min;
  }
  get max() {
    return this._max;
  }
  get timer() {
    return this._timer;
  }
  get times() {
    return this._times;
  }
  get filterKey() {
    return this._filterKey;
  }

  constructor(
    private canService: CanService
  ) {
    this._queue = [];
    this.clearFilter();
  }

  clearFilter() {
    this._filterKey = null;
    this.filterValueStartBit = 0;
    this.filterValueLength = 0;
    this._timerStartAt = null;
    this._timer = null;
    this._times = null;
    this._min = null;
    this._max = null;

  }

  setFilter(id: string, startBit: number, length: number) {
    this._filterKey = id;
    this.filterValueStartBit = startBit;
    this.filterValueLength = length;
  }

  push(entry: ICanEntry) {
    const entryMatched = this._queue.find(x => x.key === entry.key);
    if (entryMatched) {
      entryMatched.value = entry.value;
      entryMatched.time = entry.time;
    } else {
      this._queue.unshift(entry);
    }

    if (this._filterKey && this._filterKey.toUpperCase() === entry.key.toUpperCase()) {
      this.increaseTimes();
      this.extendTimer();
      this.calculateMinMax(entry.value);
    }
  }

  pop(): ICanEntry {
    return this._queue.pop();
  }

  private calculateMinMax(canData: string) {
    const buffer = Buffer.from(canData, 'hex');
    const val = this.canService.decodeJ1939(buffer, this.filterValueStartBit, this.filterValueLength);

    if (this._min === null && this._max === null) {
      this._min = val;
      this._max = val;
    }
    this._min = val < this._min ? val : this._min;
    this._max = val > this._max ? val : this._max;
  }

  private increaseTimes() {
    if (this._times === null) {
      this._times = 1;
    } else {
      this._times += 1;
    }
  }

  private extendTimer() {
    const current = new Date();
    if (this._timer === null && this._timerStartAt === null) {
      this._timer = 0;
      this._timerStartAt = current;
    } else {
      this._timer = differenceInSeconds(current, this._timerStartAt);
    }
  }
}
