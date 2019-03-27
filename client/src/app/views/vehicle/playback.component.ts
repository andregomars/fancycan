import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService, UtilityService, SmartQueueService } from '../../services';
import { Observable, BehaviorSubject, timer, NEVER } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { subMinutes, addSeconds } from 'date-fns';

import { environment } from '../../../environments/environment';
import { MapStyle } from '../shared/map-style';
import { ViewProfileState, SpnProfileState } from '../../states';
import { ActivatedRoute } from '@angular/router';
import { ICan, ICanEntry } from 'fancycan-model';

@Component({
  selector: 'app-vehicle-playback',
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.scss']
})
export class PlaybackComponent implements OnInit, OnDestroy {
  @Select(ViewProfileState.vcode) vcode$: Observable<string>;
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  @Select(ViewProfileState.vin) vin$: Observable<string>;
  @Select(SpnProfileState.spns) spnProfiles$: Observable<any[]>;
  pauser = new BehaviorSubject<boolean>(true);
  vehicleState = new BehaviorSubject<any>({});
  cansPausable$: Observable<any>;
  beginTime$: Observable<Date>;
  chosenTime$: Observable<Date>;
  cansToShow$: Observable<any>;
  marginMinutes = 3;
  timerIncrementalSec = 1;
  intSecState = 5;
  isFiltering = false;
  filterCanID: string;
  filterStartBit: number;
  filterLength: number;

  selectedTime: Date = new Date();
  // bsRangeValue: Date[];
  // maxDate = new Date();


  loadMap = environment.loadMap;
  mapMinHeight = 350;
  mapZoom = 15;
  mapStyle = new MapStyle().styler;
  bus_number: string;
  map_lat = 34.1061376;
  map_lgt = -117.8230976;
  // map_lat = 34.056539;
  // map_lgt = -118.237485;

  engineRunning = 45;
  engineIdle = 60;
  odometer = 27026.8;
  vin = 'V12W132456107';
  imgBus = 'assets/img/vehicle/bus.png';
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
    private dataService: DataService,
    private route: ActivatedRoute,
    private smartQueueService: SmartQueueService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadTime();
    this.loadData();
  }

  ngOnDestroy() {
    if (this.pauser) {
      this.pauser.unsubscribe();
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

  togglePlayer() {
    this.pauser.next(!this.pauser.value);
  }

  stopPlayer() {
    this.pauser.next(true);
    this.loadTime();
  }

  resetPlayer() {
    this.pauser.next(true);
    this.loadTime();
    this.pauser.next(false);
  }

  private loadTime() {
    this.chosenTime$ = this.route.queryParamMap.pipe(
      map(params => params.get('time') || null),
      map(time => time ? new Date(+time) : new Date())
    );

    this.beginTime$ = this.chosenTime$.pipe(
      map(time => subMinutes(time, this.marginMinutes))
    );
  }

  private loadData() {
    const cans$ = (incremental: number) => this.vcode$.pipe(
      switchMap(vcode => this.beginTime$.pipe(
        switchMap(baseTime => {
          const beginTime = addSeconds(baseTime, incremental);
          const endTime = addSeconds(beginTime, 1);
          const cansBson$ = this.dataService.getCansByDateRange(vcode, beginTime, endTime);
          return cansBson$.pipe(
            // get can entries for ui showing
            map((cansBson: ICan[]) => this.utilityService.buildCanEntries(cansBson, true)),
            // update vehicle state
            tap((canEntries: ICanEntry[]) => {
              this.updateVehicleState(canEntries, incremental);
            }),
          );
        })
      )
      )
    );

    const cansTimer$ = timer(0, this.timerIncrementalSec * 1000).pipe(
      switchMap((incremental) => cans$(incremental)),
      share()
    );

    this.cansPausable$ = this.pauser.pipe(
      switchMap(paused => paused ? NEVER : cansTimer$)
    );

    this.cansToShow$ = this.cansPausable$.pipe(
      map(cans => {
        cans.map(can => this.smartQueueService.push(can));
        return this.smartQueueService.queue;
      })
    );

  }

  private updateVehicleState(canEntries: ICanEntry[], incremental: number) {
    if (incremental % this.intSecState === 0) {
      this.spnProfiles$.pipe(
        map(spnProfiles => {
          const vStatePatched =
            this.utilityService.buildVehicleState(this.vehicleState.value, canEntries, spnProfiles);
          this.vehicleState.next(vStatePatched);
        }),
      ).subscribe();
    }
  }


}

