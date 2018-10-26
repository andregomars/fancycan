import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { MapStyle } from '../shared/map-style';

@Component({
  selector: 'app-vehicle-rtm',
  templateUrl: './rtm.component.html',
  styleUrls: ['./rtm.component.scss']
})
export class RtmComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  rawDataList: any[];
  vehicles$: Observable<any>;
  definitions$: Observable<any>;
  cans$: Observable<any>;

  loadMap = !environment.loadMap;
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
  imgBus = 'assets/img/vehicle/bus.png';
  imgEngineCheck = 'assets/img/vehicle/check_engine.png';

  constructor(
    private dataService: DataService,
    private utitlityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    // this.rawDataList = new Array<any>();
    // for (let i = 0; i < 10; i++) {
    //   this.rawDataList.push({ id: 'xxxxxxx', data: 'xx xx xx xx xx xx xx xx' });
    // }

    this.vehicles$ = this.dataService.getSnapshots().pipe(
      map(vehicles => this.utitlityService.attachMapLabel(vehicles)),
      share()
    );

    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.cans$ = this.dataService.getCANs().pipe(
      map((cans: any[]) =>
        cans.map(can => {
          return {
            id: can.id,
            value: this.utitlityService.formatRawCAN(can.value)
          };
        })
      ),
      share()
    );


    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

}
