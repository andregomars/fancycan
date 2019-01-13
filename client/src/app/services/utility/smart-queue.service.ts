import { Injectable } from '@angular/core';
import { differenceInSeconds } from 'date-fns';
import { Buffer } from 'buffer/';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class SmartQueueService {
  private _queue: IEntry[];
  private _min: number;
  private _max: number;
  private _timer: number;
  private _times: number;
  private _timerStartAt: Date;

  private filterKey: string;
  private filterValueStartBit: number;
  private filterValueLength: number;

  get queue() {
    return this._queue;
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

  constructor(
    private utilityService: UtilityService
  ) {
    this._queue = [];
    this.clearFilter();
  }

  clearFilter() {
    this.filterKey = null;
    this.filterValueStartBit = 0;
    this.filterValueLength = 0;
    this._timerStartAt = null;
    this._timer = null;
    this._times = null;
    this._min = null;
    this._max = null;

  }

  setFilter(id: string, startBit: number, length: number) {
    this.filterKey = id;
    this.filterValueStartBit = startBit;
    this.filterValueLength = length;
  }

  push(entry: IEntry) {
    const entryMatched = this._queue.find(x => x.key === entry.key);
    if (entryMatched) {
      entryMatched.value = entry.value;
    } else {
      this._queue.unshift(entry);
    }

    if (this.filterKey && this.filterKey.toUpperCase() === entry.key.toUpperCase()) {
      this.increaseTimes();
      this.extendTimer();
      this.calculateMinMax(entry.value);
    }
  }

  pop(): IEntry {
    return this._queue.pop();
  }

  private calculateMinMax(canData: string) {
    const buffer = Buffer.from(canData, 'hex');
    const val = this.utilityService.decodeJ1939(buffer, this.filterValueStartBit, this.filterValueLength);

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

export interface IEntry {
  key: string;
  value: string;
}