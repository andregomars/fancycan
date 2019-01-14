import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService, SmartQueueService } from '../../services';
import { Observable, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
// import * as moment from 'moment';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Buffer } from 'buffer/';
import { ObjectID } from 'bson';

import { environment } from '../../../environments/environment';
import { ICan } from '../../models/ican';

@Component({
  selector: 'app-vehicle-rtm',
  templateUrl: './rtm.component.html',
  styleUrls: ['./rtm.component.scss']
})
export class RtmComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  definitions$: Observable<any>;
  cans$: Observable<any>;
  isFiltering = false;
  filterCanID: string;
  filterStartBit: number;
  filterLength: number;
  private topic: string;

  lastUpdated = '2018-08-28 23:32:55';
  currentTime = new Date();
  engineRunning = 45;
  engineIdle = 60;
  odometer = 27026.8;
  // vin = 'V12W132456107';
  // imgBus = 'assets/img/vehicle/bus.png';
  imgEngineCheck = 'assets/img/vehicle/check_engine.png';

  get min() {
    return this.smartQueueService.min;
  }
  get max() {
    return this.smartQueueService.max;
  }
  get time() {
    return this.smartQueueService.timer;
  }
  get times() {
    return this.smartQueueService.times;
  }
  get filterKey() {
    return this.smartQueueService.filterKey;
  }

  constructor(
    private mqttService: MqttService,
    private dataService: DataService,
    private smartQueueService: SmartQueueService,
    // private utitlityService: UtilityService
  ) { }

  ngOnInit() {
    this.initMqtt();
    this.loadData();
    this.subscribeMqtt();
  }

  filterCans() {
    this.isFiltering = !this.isFiltering;

    if (this.isFiltering && this.filterCanID) {
      this.smartQueueService.setFilter(this.filterCanID, +this.filterStartBit, +this.filterLength);
    } else {
      this.smartQueueService.clearFilter();
    }
  }

  private subscribeMqtt() {
    this.mqttService.connect();
    this.cans$ =
      this.mqttService.observe(this.topic).pipe(
        map((message: IMqttMessage) => {
          const canMsg: ICan = JSON.parse(message.payload.toString());
          const can = {
            key: Buffer.from(canMsg.canID).toString('hex'),
            value: Buffer.from(canMsg.canData).toString('hex'),
            time: new ObjectID(canMsg.rawID).getTimestamp()
          };
          this.smartQueueService.push(can);
          return this.smartQueueService.queue;
        }),
      );
  }

  private initMqtt() {
    this.topic = environment.topic;
  }

  // private toHexString(byteArray: any[]) {
  //   return Array.from(byteArray, (byte) => {
  //     return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  //   }).join('');
  // }

  private loadData() {
    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    // this.cans$ = this.dataService.getCANs().pipe(
    //   map((cans: any[]) =>
    //     cans.slice(0, 15).map(can => {
    //       return {
    //         id: can.id,
    //         value: this.utitlityService.formatRawCAN(can.value)
    //       };
    //     })
    //   ),
    //   share()
    // );


    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

}
