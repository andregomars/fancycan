import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, } from 'rxjs';
import { share, map, tap, switchMap, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

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
export class FleetDashboardComponent implements OnInit, OnDestroy {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  vehicles$: Observable<any>;
  filteredVehicles$: Observable<any>;
  searchTerm$ = new BehaviorSubject<string>('');
  locations$ = new BehaviorSubject<any>({});
  loadMap = environment.loadMap;
  hideSideInfo: boolean;

  mapZoom = 12;
  mapMinHeight = 768;
  mapStyle = new MapStyle().styler;
  map_lat = 34.1061376;
  map_lgt = -117.8230976;
  // map_lat = 34.056539;
  // map_lgt = -118.237485;

  constructor(
    private dataService: DataService,
    private store: Store,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.hideSideInfo = false;
    this.assignVehicles();
    this.assignFilteredVehicles();
  }

  ngOnDestroy() {
    if (this.searchTerm$) {
      this.searchTerm$.unsubscribe();
    }
    if (this.locations$) {
      this.locations$.unsubscribe();
    }
  }

  resizeSideInfo() {
    this.hideSideInfo = !this.hideSideInfo;
  }

  nav(fcode: string, vcode: string, vin: string) {
    this.store.dispatch(new SetProfile(fcode, vcode, null, vin));
    this.store.dispatch(new Navigate(['/vehicle/panel', vcode]));
  }

  private assignVehicles() {
    this.vehicles$ = this.fcode$.pipe(
      switchMap(fcode => this.dataService.getVehicleStates(fcode))
    );
  }

  private assignFilteredVehicles() {
    this.filteredVehicles$ = this.search(this.searchTerm$).pipe(
      tap(vehicles => {
        const vlocs = vehicles.map((v: any) => this.mapSPNtoGeo(v));
        const locs = this.utilityService.attachGeoLocationAndMapLabel(vlocs);
        this.locations$.next(locs);
      })
    );

  }

  private search(term$: Observable<string>) {
    return term$.pipe(
      // filter(term => term.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    );
  }

  private searchEntries(term: string): Observable<string> {
    if (!term || term.length === 0 || term.trim().length === 0) {
      return this.vehicles$;
    }

    return this.vehicles$.pipe(
      map(vehicles =>
        vehicles.filter(v => v.vcode.toString().toUpperCase().indexOf(term.trim().toUpperCase()) > -1))
    );

  }

  private mapSPNtoGeo(vehicle: any): any {
    if (!vehicle || !vehicle.spn584 || !vehicle.spn585) {
      return vehicle;
    }

    vehicle.geolocations = [ { latitude: vehicle.spn584, longitude: vehicle.spn585 } ];
    return vehicle;

  }


}
