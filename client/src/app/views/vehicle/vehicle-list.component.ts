import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable, timer } from 'rxjs';
import { ViewProfileStateModel } from '../../models';
import { switchMap, map, debounce, tap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { ViewProfileState } from '../../states';
import { SetProfile } from '../../actions';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  @Select(ViewProfileState) viewProfile$: Observable<ViewProfileStateModel>;
  bus_number: string;
  vehicles$: Observable<any>;
  filteredVehicles$: Observable<any>;
  isListView = true;

  constructor(
    private utilityService: UtilityService,
    private dataService: DataService,
    private store: Store
  ) { }

  ngOnInit() {
    this.loadData();
    this.filteredVehicles$ = this.vehicles$;
  }

  nav(fcode: string, vcode: string) {
    this.store.dispatch(new SetProfile(fcode, vcode, null, null));
    this.store.dispatch(new Navigate(['/vehicle/panel', vcode]));
  }

  navSetting() {
    this.store.dispatch(new Navigate(['/setting/fleet']));
  }

  filterVehicles(vcode: string) {
      if (!vcode || vcode.length === 0) {
        this.loadData();
        return;
      }

      this.filteredVehicles$ = this.vehicles$.pipe(
        debounce(() => timer(300)),
        map(vehicles =>
          vehicles.filter(v => v.code.toUpperCase().indexOf(vcode.trim().toUpperCase()) > -1)
        ),
      );
  }

  private loadData() {
    this.vehicles$ = this.viewProfile$.pipe(
      switchMap(profile => {
        const fleets$ = this.dataService.getFleets();
        return this.utilityService.getVehiclesByFleetCode(profile.fcode, fleets$);
      }),
    );
  }
}
