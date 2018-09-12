import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services';
import { Observable } from 'rxjs';
import { ViewProfile } from '../../model';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {
  viewProfile$: Observable<ViewProfile>;
  vehicles = ['5001', '5002', '5003', '5012', '5030', '5075'];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.viewProfile$ = this.storageService.watchViewProfile();
  }

  nav(fcode: string, vcode: string) {
    this.router.navigate(['/vehicle', vcode]);
    const viewProfile: ViewProfile = {
      fleet_code: fcode,
      vehicle_code: vcode,
    };

    this.storageService.setViewProfile(viewProfile);
  }

}
