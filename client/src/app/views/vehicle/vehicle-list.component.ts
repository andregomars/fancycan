import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, DataService } from '../../services';
import { Observable } from 'rxjs';
import { ViewProfile } from '../../model';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  viewProfile$: Observable<ViewProfile>;
  vehicles$: Observable<any>;

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.viewProfile$ = this.storageService.watchViewProfile();
    this.loadData();
  }

  nav(fcode: string, vcode: string) {
    this.router.navigate(['/vehicle', vcode]);
    const viewProfile: ViewProfile = {
      fleet_code: fcode,
      vehicle_code: vcode,
    };

    this.storageService.setViewProfile(viewProfile);
  }

  private loadData() {
    this.vehicles$ = this.viewProfile$.pipe(
      switchMap(profile =>
        this.dataService.getFleets().pipe(
          map(fleets => fleets.find(fleet =>
            fleet.code.toUpperCase() === profile.fleet_code.toUpperCase())
          ),
          map(fleet => {
            return fleet.vehicles.map(vehicle => {
              return {
                vcode: vehicle.code,
                fcode: profile.fleet_code
              };
            });
          })
        )
      ),
    );
  }
}
