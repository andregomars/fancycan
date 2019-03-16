import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable, BehaviorSubject, timer, NEVER } from 'rxjs';
import { map, share, switchMap, tap, timeout, take } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { subMinutes, addSeconds } from 'date-fns';

import { environment } from '../../../environments/environment';
import { MapStyle } from '../shared/map-style';
import { ViewProfileState } from '../../states';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle-playback',
  templateUrl: './playback.component.html',
  styleUrls: ['./playback.component.scss']
})
export class PlaybackComponent implements OnInit {
  @Select(ViewProfileState.vcode) vcode$: Observable<string>;
  pauser = new BehaviorSubject<boolean>(true);
  cansPausable$: Observable<any>;
  beginTime$: Observable<Date>;
  chosenTime$: Observable<Date>;
  marginMinutes = 3;
  timerIncrementalSec = 1;


  selectedTime: Date = new Date();
  // bsRangeValue: Date[];
  // maxDate = new Date();


  loadMap = environment.loadMap;
  mapMinHeight = 350;
  mapZoom = 10;
  mapStyle = new MapStyle().styler;
  bus_number: string;
  map_lat = 34.056539;
  map_lgt = -118.237485;
  // gaugeType = 'semi';
  // gaugeThick = 15;

  engineRunning = 45;
  engineIdle = 60;
  odometer = 27026.8;
  vin = 'V12W132456107';
  imgBus = 'assets/img/vehicle/bus.png';
  imgEngineCheck = 'assets/img/vehicle/check_engine.png';

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadTime();
    this.loadData();
  }

  public togglePlayer() {
    this.pauser.next(!this.pauser.value);
  }

  public stopPlayer() {
    this.pauser.next(true);
    this.loadTime();
  }

  public resetPlayer() {
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
          return this.dataService.getCansByDateRange(vcode, beginTime, endTime);
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


    // this.maxDate.setDate(this.maxDate.getDate() + 7);
    // this.bsRangeValue = [this.bsValue, this.maxDate];
  }


}

