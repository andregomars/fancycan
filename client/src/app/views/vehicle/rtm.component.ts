import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService, SmartQueueService, UtilityService } from '../../services';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { MqttService, IMqttMessage } from 'ngx-mqtt';

import { environment } from '../../../environments/environment';
import { ICanEntry, Dm1Collection, ICan } from 'fancycan-model';
import { Dm1AlertService } from '../../services/utility/dm1-alert.service';
import { SpnProfileState } from '../../states';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-vehicle-rtm',
  templateUrl: './rtm.component.html',
  styleUrls: ['./rtm.component.scss']
})
export class RtmComponent implements OnInit, OnDestroy {
  @Select(SpnProfileState.spns) spnProfiles$: Observable<any[]>;
  vehicleState = new BehaviorSubject<any>({});

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  // definitions$: Observable<any>;
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

  get listDm1Collection(): Dm1Collection {
    return this.dm1AlertService.listDm1Collection;
  }
  get listDm1SingleRaw(): ICanEntry[] {
    return this.dm1AlertService.listDm1SingleRaw;
  }
  get listDm1MultipleRaw(): ICanEntry[] {
    return this.dm1AlertService.listDm1MultipleRaw;
  }

  constructor(
    private mqttService: MqttService,
    private dataService: DataService,
    private smartQueueService: SmartQueueService,
    private dm1AlertService: Dm1AlertService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.initMqtt();
    this.loadData();
    this.subscribeMqtt();
  }

  ngOnDestroy() {
    if (this.mqttService) {
      this.mqttService.disconnect();
    }
    if (this.vehicleState) {
      this.vehicleState.unsubscribe();
    }

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
          const can: ICan = JSON.parse(message.payload.toString());
          const canEntry = this.utilityService.buildCanEntry(can);
          this.smartQueueService.push(canEntry);
          this.dm1AlertService.push(canEntry);
          this.updatePaticularVehicleState(canEntry);
          return this.smartQueueService.queue;
        }),
      );
  }

  private initMqtt() {
    this.topic = environment.topic;
  }


  private loadData() {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  private updatePaticularVehicleState(canEntry: ICanEntry) {
      this.spnProfiles$.pipe(
        map(spnProfiles => {
          const vStatePatched =
            this.utilityService.buildVehicleState(this.vehicleState.value, [canEntry], spnProfiles);
          this.vehicleState.next(vStatePatched);
        }),
      ).subscribe();
  }
}
