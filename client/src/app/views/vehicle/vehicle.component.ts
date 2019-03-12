import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { Observable, timer, of } from 'rxjs';
import { DataService, UtilityService } from '../../services';
import { share, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MapStyle } from './../shared/map-style';
import { Select } from '@ngxs/store';
import { ViewProfileState, SpnProfileState } from '../../states';
import { PlayChartComponent } from '../../components/play-chart/play-chart.component';
// import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  // animations: [
  //   // the fade-in/fade-out animation.
  //   trigger('simpleFadeAnimation', [

  //     // the "in" style determines the "resting" state of the element when it is visible.
  //     state('in', style({ opacity: 1 })),

  //     // fade in when created. this could also be written as transition('void => *')
  //     transition(':enter', [
  //       style({ opacity: 0 }),
  //       animate(600)
  //     ]),

  //     // fade out when destroyed. this could also be written as transition('void => *')
  //     transition(':leave',
  //       animate(600, style({ opacity: 0 })))
  //   ])
  // ]
})
export class VehicleComponent implements OnInit, OnDestroy {
  @Select(ViewProfileState.vcode) vcode$: Observable<string>;
  @Select(SpnProfileState.spns) spns$: Observable<any[]>;
  @ViewChild('playChart') playChart: PlayChartComponent;

  isAutoSync = true;
  intSecState = 7;
  itv: any;
  len = 30;
  intSec = 1;
  temperatureMax = 300;
  temperatureMin = -300;
  queue: any[];
  alerts$: Observable<any>;
  // decodes$: Observable<any>;
  vehicleStateSpnList$: Observable<any>;
  vehicles$: Observable<any>;
  vehicle$: Observable<any>;
  playChartData$: Observable<any>;
  playChartLabels: string[];

  // map config
  loadMap = environment.loadMap;
  mapMinHeight = 350;
  mapZoom = 15;
  mapStyle = new MapStyle().styler;
  bus_number: string;
  map_lat = 34.056539;
  map_lgt = -118.237485;

  // gauge config
  gaugeForegroundColor = '#17a2b8';
  gaugeType = 'semi';
  gaugeThick = 15;

  lastUpdated = '2018-08-28 23:32:55';
  // currentTime = new Date();
  currentTime$: Observable<Date>;
  engineRunning = 45;
  engineIdle = 60;
  odometer = 27026.8;
  vin = 'V12W132456107';
  imgBus = 'assets/img/vehicle/bus.png';
  imgEngineCheck = 'assets/img/vehicle/check_engine.png';
  imgTransmissionCheck = 'assets/img/vehicle/check_transmission.png';

  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [12, 28],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['Idle', 'Running'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    }

  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';

  constructor(
    private utilityService: UtilityService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadTimeLabel();
    this.loadVehicleState();
    this.loadVehicleStatePeriodically();
    this.loadPlayChartData();
    // this.playChart.pause();
  }

  ngOnDestroy() {
    this.clearAutoSync();
  }

  switchSyncStatus() {
    this.isAutoSync = !this.isAutoSync;
    if (this.isAutoSync) {
      this.loadVehicleStatePeriodically();
    } else {
      this.clearAutoSync();
    }
  }

  clearAutoSync() {
    if (this.itv) {
      clearInterval(this.itv);
    }
  }

  private loadTimeLabel() {
    // this.currentTime$ = new Observable<Date>((observer: Observer<Date>) => {
    //   setInterval(() => observer.next(new Date()), 1000);
    // });
    this.currentTime$ = timer(0, 1000).pipe(
      map(() => new Date())
    );
  }

  private loadVehicleStatePeriodically() {
    this.itv = setInterval(() => {
      this.loadVehicleState();
    }, this.intSecState * 1000);
  }

  private loadVehicleState() {
    // this.vehicle$ = this.vcode$.pipe(
    //   switchMap(vcode => this.dataService.getVehicleState(vcode)),
    //   map(vehicles => this.utilityService.attachGeoLabels(vehicles[0])),
    //   share()
    // );

    this.vehicle$ = this.vcode$.pipe(
      switchMap(vcode => this.dataService.getVehicleState(vcode)),
      map(vehicles => this.utilityService.attachGeoLocationAndMapLabel(vehicles)[0]),
      share()
    );

    this.vehicleStateSpnList$ = this.vehicle$.pipe(
      switchMap(state => this.spns$.pipe(
        map(spns => this.utilityService.buildVehicleStateSpnList(state, spns))
      ))
    );

    this.alerts$ = this.vcode$.pipe(
      switchMap(vcode => this.dataService.getVehicleMalfuncStatesByLatestN(vcode, 5)),
      // map((alerts: any[]) => alerts.slice(0, 5)),
      share()
    );

    // this.decodes$ = this.dataService.getDecodes().pipe(
    //   share()
    // );
  }

  private loadPlayChartData() {
    this.playChartLabels = Array.from(new Array(this.len), (v, i) =>
      `${((this.len - i - 1) * this.intSec)}s`
    );
    // this.playChartData$ = this.utilityService.getCurrentData();
    // this.playChartData$ = timer(0, this.intSec * 1000).pipe(map(n => n * 100));
    // this.playChartData$ = of(0);
  }

}
