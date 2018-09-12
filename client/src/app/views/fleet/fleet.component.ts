import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services';
import { Observable } from 'rxjs';
import { ViewProfile } from '../../model';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {
  viewProfile$: Observable<ViewProfile>;
  fleets = ['LAMTA', 'AVTA', 'BYD', 'LBT', 'RTD', 'Soltran'];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.viewProfile$ = this.storageService.watchViewProfile();
  }

  nav(fcode: string) {
    this.router.navigate(['/fleet/dashboard']);
    const viewProfile: ViewProfile = {
      fleet_code: fcode,
      vehicle_code: '',
    };

    this.storageService.setViewProfile(viewProfile);
  }

}
