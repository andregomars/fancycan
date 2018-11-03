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
  definitions$: Observable<any>;
  cans$: Observable<any>;

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
    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.cans$ = this.dataService.getCANs().pipe(
      map((cans: any[]) =>
        cans.slice(0, 15).map(can => {
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
