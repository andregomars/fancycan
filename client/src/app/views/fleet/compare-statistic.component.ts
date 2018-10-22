import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService, UtilityService } from '../../services';
import { share, map, switchMap, tap } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { ViewProfileState } from '../../states';
import { IOption } from 'ng-select';

@Component({
  selector: 'app-compare-statistic',
  templateUrl: './compare-statistic.component.html',
  styleUrls: ['./compare-statistic.component.scss']
})
export class CompareStatisticComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  definitions$: Observable<any[]>;
  spnList$: Observable<any[]>;
  vehicleList$: Observable<any[]>;
  vehicleOptions$: Observable<any[]>;

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {

    this.loadDefault();
  }

  loadDefault() {
    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.spnList$ = this.definitions$.pipe(
      map(defs => defs.map(def => {
        return {
          label: def.spn,
          value: def.spn
        };
      }))
    );

    const fleets$ = this.dataService.getFleets();
    this.vehicleList$ = this.fcode$.pipe(
      switchMap(fcode =>
        this.utilityService.getVehiclesByFleetCode(fcode, fleets$)),
      share()
    );

    this.vehicleOptions$ = this.vehicleList$.pipe(
      tap(x => console.log(x)),
      map(vehicles => vehicles.map(vehicle => {
        return {
          label: vehicle.vcode,
          value: vehicle.vcode
        } as IOption;
      }))
    );
  }
}
