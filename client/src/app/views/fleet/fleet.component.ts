import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { DataService } from '../../services';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {
  mapMinHeight = 768;
  vehicles$: Observable<any>;
  bus_number: string;
  map_lat = 34.056539;
  map_lgt = -118.237485;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.vehicles$ = this.dataService.getVehicles().pipe(
      share()
    );
  }

  filterVehicles(busno: string) {
      if (!busno || busno.length === 0) {
        this.loadData();
        return;
      }

      // if (!busno || busno.length < 2) {
      //   return;
      // }

      this.vehicles$ = this.dataService.getVehicles().pipe(
        map(vehicles =>
          vehicles.filter(v => v.bus_number.toString().toUpperCase().indexOf(busno.trim().toUpperCase()) > -1)
        ),
      );
  }

}
