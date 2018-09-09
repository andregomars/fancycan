import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { DataService } from '../../services';
import { share, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MapStyle } from './../shared/map-style';

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

  loadMap = environment.loadMap;
  mapMinHeight = 350;
  mapZoom = 15;
  mapStyle = new MapStyle().styler;
  bus_number: string;
  map_lat = 34.056539;
  map_lgt = -118.237485;
  gaugeType = 'semi';
  gaugeThick = 15;

  lastUpdated = '2018-08-28 23:32:55';
  currentTime = moment().toDate();
  engineRunning = 45;
  engineIdle = 60;
  odometer = 27026.8;
  vin = 'V12W132456107';
  // imgBus = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxTQs-WUfduw5KFdJ6cpeCpZKsA0cOx8XVGaRuTwLffC48M8Pk';
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
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.vehicles$ = this.dataService.getVehicles().pipe(
      map(vehicles => this.attachMapLabel(vehicles)),
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

  private attachMapLabel(vehicles: any): any {
    return vehicles.map(ve => {
      return Object.assign(ve, {
        label: {
          color: '#ffffff',
          fontFamily: '',
          fontSize: '9px',
          fontWeight: 'normal',
          text: ve.bus_number.toString()
        }
      });
    });
  }

}
