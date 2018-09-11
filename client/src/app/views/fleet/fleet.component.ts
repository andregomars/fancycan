import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {
  fcode$: Observable<string>;
  fleets = ['LAMTA', 'AVTA', 'BYD', 'LBT', 'RTD', 'Soltran'];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fcode$ = this.storageService.watchFcode();
  }

  nav(item: string) {
    this.router.navigate(['/fleet/dashboard']);
    // localStorage.setItem('fcode', item);
    this.storageService.setFcode(item);
  }

}
