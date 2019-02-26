import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable } from 'rxjs';
import { map, share, switchMap, tap, timeout, take } from 'rxjs/operators';
import { Select } from '@ngxs/store';

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
  selectedTime: Date = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  rawDataList: any[];
  vehicle$: Observable<any>;
  vehicles$: Observable<any>;
  // definitions$: Observable<any>;
  cans$: Observable<any>;
  checklist$: Observable<any>;

  loadMap = environment.loadMap;
  mapMinHeight = 350;
  mapZoom = 10;
  mapStyle = new MapStyle().styler;
  bus_number: string;
  map_lat = 34.056539;
  map_lgt = -118.237485;
  gaugeType = 'semi';
  gaugeThick = 15;

  lastUpdated = '2018-08-28 23:32:55';
  startTime$: Observable<Date>;
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
    this.loadVehicle();
    this.loadChecklist();
  }

  private loadChecklist() {
    this.checklist$ = this.vcode$.pipe(
      switchMap(vcode =>
        this.dataService.getChecklist().pipe(
          map((items: any[]) =>
            items.filter(item => item.vehicle_code === vcode))
        )),
      share()
    );
  }

  private loadTime() {
    this.startTime$ = this.route.queryParamMap.pipe(
      map(params => params.get('time') || null),
      map(time => time ? new Date(time) : new Date()),
      tap(time => {
        setTimeout(() => {
          this.selectedTime = time;
        }, 100);
      })
    );
  }

  private loadData() {
    this.vehicles$ = this.dataService.getRealtimeStates().pipe(
      switchMap(states =>
        this.vcode$.pipe(
          map(vcode =>
            states.filter(state => state.code === vcode)
          )
        )
      ),
      map(vehicles => this.utilityService.attachMapLabels(vehicles)),
      share()
    );

    // this.definitions$ = this.dataService.getDefinitions().pipe(
    //   share()
    // );

    this.cans$ = this.dataService.getCANs().pipe(
      map((cans: any[]) =>
        cans.slice(0, 15).map(can => {
          return {
            id: can.id,
            value: this.utilityService.formatRawCAN(can.value)
          };
        })
      ),
      share()
    );

    // this.maxDate.setDate(this.maxDate.getDate() + 7);
    // this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  private loadVehicle() {
    this.vehicle$ = this.vehicles$.pipe(
      map(vehicles => vehicles[0])
    );
    // this.vehicle$ = this.dataService.getPanels().pipe(
    //   switchMap(vehicles =>
    //     this.vcode$.pipe(
    //       map(vcode =>
    //         vehicles.find(vehicle => vehicle.code === vcode)
    //       )
    //     )
    //   ),
    //   share()
    // );
  }
}

