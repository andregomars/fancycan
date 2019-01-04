import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DataService, UtilityService } from '../../services';
import { share, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MapStyle } from './../shared/map-style';
import { ViewProfile } from '../../models';
import { Store, Select } from '@ngxs/store';
import { ViewProfileState } from '../../states';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  @Select(ViewProfileState.vcode) vcode$: Observable<string>;
  len = 30;
  intSec = 1;
  temperatureMax = 300;
  temperatureMin = -300;
  queue: any[];
  alerts$: Observable<any>;
  definitions$: Observable<any>;
  decodes$: Observable<any>;
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
  currentTime = moment().toDate();
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
    this.loadVehicleStates();
    this.loadVehicle();
    this.loadPlayChartData();

    this.loadVehicleState();
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

  private loadVehicleStates() {
    this.vehicles$ = this.dataService.getRealtimeStates().pipe(
      switchMap(states =>
        this.vcode$.pipe(
          map(vcode =>
            states.filter(state => state.code === vcode)
          )
        )
      ),
      map(vehicles => this.utilityService.attachMapLabel(vehicles)),
      share()
    );

    this.alerts$ = this.dataService.getAlertStats().pipe(
      map((alerts: any[]) => alerts.slice(0, 5)),
      share()
    );

    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.decodes$ = this.dataService.getDecodes().pipe(
      share()
    );
  }

  private loadVehicleState() {
    this.dataService.getVehicleState('6001').subscribe(x => console.log(x));
  }

  private loadPlayChartData() {
    this.playChartLabels = Array.from(new Array(this.len), (v, i) =>
      `${((this.len - i - 1) * this.intSec)}s`
    );
    this.playChartData$ = this.utilityService.getCurrentData();
  }

}
