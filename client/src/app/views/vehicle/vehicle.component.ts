import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { Observable, timer, of, BehaviorSubject, NEVER } from 'rxjs';
import { share, map, tap, switchMap, shareReplay } from 'rxjs/operators';
import { Select } from '@ngxs/store';

import { DataService, UtilityService } from '../../services';
import { environment } from '../../../environments/environment';
import { MapStyle } from './../shared/map-style';
import { ViewProfileState, SpnProfileState } from '../../states';
import { PlayChartComponent } from '../../components/play-chart/play-chart.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
})
export class VehicleComponent implements OnInit, OnDestroy {
  @Select(ViewProfileState.vcode) vcode$: Observable<string>;
  @Select(ViewProfileState.vin) vin$: Observable<string>;
  @Select(SpnProfileState.spns) spns$: Observable<any[]>;
  @ViewChild('playChart') playChart: PlayChartComponent;
  syncSpinner = new BehaviorSubject<boolean>(false);
  pauser = new BehaviorSubject<boolean>(false);

  intSecPlayChart = 1;
  intSecState = 5;
  intSecSpin = 1;

  len = 30;
  temperatureMax = 300;
  temperatureMin = -300;
  alerts$: Observable<any>;
  vehicleStateSpnList$: Observable<any>;
  vehicle$: Observable<any>;
  playChartData$: Observable<any>;
  playChartLabels: string[];

  // map config
  loadMap = environment.loadMap;
  mapMinHeight = 350;
  mapZoom = 15;
  mapStyle = new MapStyle().styler;
  bus_number: string;
  map_lat = 34.1061376;
  map_lgt = -117.8230976;
  // map_lat = 34.056539;
  // map_lgt = -118.237485;

  // // gauge config
  // gaugeForegroundColor = '#17a2b8';
  // gaugeType = 'semi';
  // gaugeThick = 15;

  currentTime$: Observable<Date>;
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
    this.loadVehicle();
    this.loadSpns();
    this.loadAlerts();
    this.loadPlayChartData();
  }

  ngOnDestroy() {
    if (this.pauser) {
      this.pauser.unsubscribe();
    }
    if (this.syncSpinner) {
      this.syncSpinner.unsubscribe();
    }
  }

  toggleSyncStatus() {
    this.pauser.next(!this.pauser.value);
  }

  private loadVehicle() {
    const vehicleOnTimer$ = timer(0, this.intSecState * 1000).pipe(
      tap(() => this.syncSpinner.next(true)),
      switchMap(() =>
        this.vcode$.pipe(
          switchMap(vcode => this.dataService.getVehicleState(vcode)),
          map(vehicles => this.utilityService.attachGeoLocationAndMapLabel(vehicles)[0]),
      )),
      // extend spinning effect for the spinner
      tap(() => timer(this.intSecSpin * 1000).subscribe(() => this.syncSpinner.next(false))),
      share()
    );

    this.vehicle$ = this.pauser.pipe(
      switchMap(paused => paused ? NEVER : vehicleOnTimer$)
    );

  }

  private loadSpns() {
    this.vehicleStateSpnList$ = this.vehicle$.pipe(
        switchMap(state => this.spns$.pipe(
          map(spns => this.utilityService.buildVehicleStateSpnList(state, spns))
        )),
    );
  }

  private loadAlerts() {
    const alertOnTimer$ = timer(0, this.intSecState * 1000).pipe(
      switchMap(() =>
        this.vcode$.pipe(
          switchMap(vcode => this.dataService.getVehicleMalfuncStatesByLatestN(vcode, 5)),
      ))
    );

    this.alerts$ = this.pauser.pipe(
      switchMap(paused => paused ? NEVER : alertOnTimer$)
    );
  }

  private loadTimeLabel() {
    this.currentTime$ = timer(0, 1000).pipe(
      map(() => new Date())
    );
  }

  private loadPlayChartData() {
    this.playChartLabels = Array.from(new Array(this.len), (v, i) =>
      `${((this.len - i - 1) * this.intSecPlayChart)}s`
    );
    // this.playChartData$ = this.utilityService.getCurrentData();
    // this.playChartData$ = timer(0, this.intSec * 1000).pipe(map(n => n * 100));
    // this.playChartData$ = of(0);
  }

}
