import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map, tap, debounceTime, distinctUntilChanged, share } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { ViewProfileState } from '../../states';
import { SetProfile } from '../../actions';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  vehicles$: Observable<any>;
  filteredVehicles$: Observable<any>;
  searchTerm$ = new BehaviorSubject<string>('');
  isListView = true;

  constructor(
    private utilityService: UtilityService,
    private dataService: DataService,
    private store: Store
  ) { }

  ngOnInit() {
    this.assignVehicles();
    this.assignFilteredVehicles();
  }

  ngOnDestroy() {
    if (this.searchTerm$) {
      this.searchTerm$.unsubscribe();
    }
  }

  nav(fcode: string, vcode: string, vin: string) {
    this.store.dispatch(new SetProfile(fcode, vcode, null, vin));
    this.store.dispatch(new Navigate(['/vehicle/panel', vcode]));
  }

  navSetting() {
    this.store.dispatch(new Navigate(['/setting/fleet']));
  }

  toggleView() {
    this.isListView = !this.isListView;
  }

  private assignVehicles() {
    this.vehicles$ = this.fcode$.pipe(
      switchMap(fcode => {
        const fleets$ = this.dataService.getFleets();
        return this.utilityService.getVehiclesByFleetCode(fcode, fleets$);
      })
    );
  }

  private assignFilteredVehicles() {
    this.filteredVehicles$ = this.search(this.searchTerm$);
  }

  private search(term$: Observable<string>) {
    return term$.pipe(
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
        vehicles.filter(v => v.code.toUpperCase().indexOf(term.trim().toUpperCase()) > -1)
      )
    );

  }

}
