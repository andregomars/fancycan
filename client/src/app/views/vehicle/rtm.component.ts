import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable, Subscription } from 'rxjs';
import { map, share, shareReplay, tap, take, bufferCount } from 'rxjs/operators';
import * as moment from 'moment';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Buffer } from 'buffer/';

import { environment } from '../../../environments/environment';
import { ICan } from '../../models/ican';
import { MapStyle } from '../shared/map-style';

@Component({
  selector: 'app-vehicle-rtm',
  templateUrl: './rtm.component.html',
  styleUrls: ['./rtm.component.scss']
})
export class RtmComponent implements OnInit, OnDestroy {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  definitions$: Observable<any>;
  cans$: Observable<any>;
  private subscription: Subscription;
  private topic: string;

  lastUpdated = '2018-08-28 23:32:55';
  currentTime = moment().toDate();
  engineRunning = 45;
  engineIdle = 60;
  odometer = 27026.8;
  vin = 'V12W132456107';
  imgBus = 'assets/img/vehicle/bus.png';
  imgEngineCheck = 'assets/img/vehicle/check_engine.png';

  constructor(
    private mqttService: MqttService,
    private dataService: DataService,
    private utitlityService: UtilityService
  ) { }

  ngOnInit() {
    this.initMqtt();
    this.loadData();
    this.subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private subscribe() {
    this.mqttService.connect();
    const queue = [];
    this.cans$ =
      this.mqttService.observe(this.topic).pipe(
        map((message: IMqttMessage) => {
          const canMsg: ICan = JSON.parse(message.payload.toString());
          const can = {
            id: Buffer.from(canMsg.canID).toString('hex'),
            value: Buffer.from(canMsg.canData).toString('hex'),
          };
          if (queue.length > environment.rtmMessagesMaxCount) {
            queue.pop();
          }
          queue.unshift(can);
          return queue;
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
