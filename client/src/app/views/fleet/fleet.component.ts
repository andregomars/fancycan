import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../services';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {
  mapMinHeight = 768;
  vehicles$: Observable<any>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.vehicles$ = this.dataService.getVehicles();
  }

}
