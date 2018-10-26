import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { share, map, tap, debounce, switchMap } from 'rxjs/operators';

import { DataService, UtilityService } from '../../services';
import { MapStyle } from './../shared/map-style';
import { environment } from '../../../environments/environment';
import { Select, Store } from '@ngxs/store';
import { ViewProfileState } from '../../states';
import { Navigate } from '@ngxs/router-plugin';
import { SetProfile } from '../../actions';

@Component({
  selector: 'app-fleet-dashboard',
  templateUrl: './fleet-dashboard.component.html',
  styleUrls: ['./fleet-dashboard.component.scss']
})
export class FleetDashboardComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;

  hideSideInfo: boolean;
  loadMap = environment.loadMap;
  mapMinHeight = 768;
  mapZoom = 12;
  mapStyle = new MapStyle().styler;
  vehicles$: Observable<any>;
  filteredVehicles$: Observable<any>;
  map_lat = 34.056539;
  map_lgt = -118.237485;

  constructor(
    private dataService: DataService,
    private store: Store,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.hideSideInfo = false;
    this.loadData();
    this.filteredVehicles$ = this.vehicles$;
  }

  filterVehicles(vcode: string) {
      if (!vcode || vcode.length === 0) {
        this.loadData();
        this.filteredVehicles$ = this.vehicles$;
        return;
      }

      this.filteredVehicles$ = this.vehicles$.pipe(
        debounce(() => timer(300)),
        map(vehicles =>
          vehicles.filter(v => v.code.toString().toUpperCase().indexOf(vcode.trim().toUpperCase()) > -1)
        )
      );
  }

  resizeSideInfo() {
    this.hideSideInfo = !this.hideSideInfo;
  }

  nav(fcode: string, vcode: string) {
    this.store.dispatch(new SetProfile(fcode, vcode));
    this.store.dispatch(new Navigate(['/vehicle/snapshot', vcode]));
  }

  private loadData() {
    this.vehicles$ = this.dataService.getSnapshots().pipe(
      switchMap(vehicles =>
          this.fcode$.pipe(
            map(fcode => vehicles.filter(vehicle => vehicle.fleet_code === fcode))
        )
      ),
      map(vehicles => this.utilityService.attachMapLabel(vehicles)),
      share()
    );
  }

}
