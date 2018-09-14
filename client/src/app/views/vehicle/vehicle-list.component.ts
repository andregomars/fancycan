import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, DataService, UtilityService } from '../../services';
import { Observable, timer } from 'rxjs';
import { ViewProfile } from '../../model';
import { switchMap, map, share, debounce, tap } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  bus_number: string;
  viewProfile$: Observable<ViewProfile>;
  vehicles$: Observable<any>;
  filteredVehicles$: Observable<any>;

  constructor(
    private storageService: StorageService,
    private utilityService: UtilityService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.viewProfile$ = this.storageService.watchViewProfile();
    this.loadData();
    this.filteredVehicles$ = this.vehicles$;
  }

  nav(fcode: string, vcode: string) {
    this.router.navigate(['/vehicle', vcode]);
    const viewProfile: ViewProfile = {
      fleet_code: fcode,
      vehicle_code: vcode,
    };

    this.storageService.setViewProfile(viewProfile);
  }

  filterVehicles(vcode: string) {
      if (!vcode || vcode.length === 0) {
        this.loadData();
        return;
      }

      this.filteredVehicles$ = this.vehicles$.pipe(
        debounce(() => timer(300)),
        map(vehicles =>
          vehicles.filter(v => v.vcode.toUpperCase().indexOf(vcode.trim().toUpperCase()) > -1)
        ),
      );
  }

  private loadData() {
    this.vehicles$ = this.viewProfile$.pipe(
      switchMap(profile => {
        const fleets$ = this.dataService.getFleets();
        return this.utilityService.getVehiclesByFleetCode(profile.fleet_code, fleets$);
      })
    );
  }
}
