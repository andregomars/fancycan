import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, DataService } from '../../services';
import { Observable } from 'rxjs';
import { ViewProfile } from '../../model';
import { map, share } from 'rxjs/operators';

@Component({
  selector: 'app-fleet-list',
  templateUrl: './fleet-list.component.html',
  styleUrls: ['./fleet-list.component.scss']
})
export class FleetListComponent implements OnInit {
  viewProfile$: Observable<ViewProfile>;
  fleets$: Observable<any>;

  constructor(
    private storageService: StorageService,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.viewProfile$ = this.storageService.watchViewProfile();
    this.loadData();
  }

  nav(fcode: string) {
    this.router.navigate(['/fleet', fcode]);
    const viewProfile: ViewProfile = {
      fleet_code: fcode,
      vehicle_code: '',
    };

    this.storageService.setViewProfile(viewProfile);
  }

  private loadData() {
    this.fleets$ = this.dataService.getFleets().pipe(
      share()
    );
  }
}
