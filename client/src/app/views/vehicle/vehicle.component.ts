import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DataService, UtilityService, StorageService } from '../../services';
import { share, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MapStyle } from './../shared/map-style';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ViewProfile } from '../../model';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss']
})
export class VehicleComponent implements OnInit {
  alerts$: Observable<any>;
  definitions$: Observable<any>;
  decodes$: Observable<any>;
  vehicles$: Observable<any>;
  vehicle$: Observable<any>;

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

   // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [12, 13, 25, 22, 32, 55, 66, 77, 88, 89, 99],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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
    private route: ActivatedRoute,
    private utilityService: UtilityService,
    private storageService: StorageService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.initViewProfile();
    this.loadVehicles();
    this.loadVehicle();
  }

  private initViewProfile() {
    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      switchMap((vcode: string) => {
          const fleets$ = this.dataService.getFleets();
          return this.utilityService.getViewProfileByVehicleCode(vcode, fleets$);
        }
      )
    ).subscribe((profile: ViewProfile) => {
      this.storageService.setViewProfile(profile);
    });
  }

  private loadVehicle() {
    this.vehicle$ = this.dataService.getVehicles().pipe(
      switchMap(vehicles =>
        this.storageService.watchViewProfile().pipe(
          map(profile =>
            vehicles.find(vehicle => vehicle.code === profile.vehicle_code)
          )
        )
      ),
      share()
    );
  }

  private loadVehicles() {
    this.vehicles$ = this.dataService.getVehicles().pipe(
      map(vehicles => this.utilityService.attachMapLabel(vehicles)),
      share()
    );

    this.alerts$ = this.dataService.getAlerts().pipe(
      share()
    );

    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.decodes$ = this.dataService.getDecodes().pipe(
      share()
    );
  }

}
