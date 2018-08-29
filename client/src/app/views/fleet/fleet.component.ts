import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { share, map, tap } from 'rxjs/operators';
import { MarkerLabel } from '@agm/core';

import { DataService } from '../../services';
import { MapStyle } from './map-style';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.scss']
})
export class FleetComponent implements OnInit {
  mapMinHeight = 768;
  mapZoom = 12;
  mapStyle = new MapStyle().styler;
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
      map(vehicles => this.attachMapLabel(vehicles)),
      tap(x => console.log(x)),
      share()
    );
  }

  filterVehicles(busno: string) {
      if (!busno || busno.length === 0) {
        this.loadData();
        return;
      }

      this.vehicles$ = this.dataService.getVehicles().pipe(
        map(vehicles => this.attachMapLabel(vehicles)),
        map(vehicles =>
          vehicles.filter(v => v.bus_number.toString().toUpperCase().indexOf(busno.trim().toUpperCase()) > -1)
        ),
      );
  }

  private attachMapLabel(vehicles: any): any {
    return vehicles.map(ve => {
      return Object.assign(ve, {
        label: {
          color: '#ffffff',
          fontFamily: '',
          fontSize: '11px',
          fontWeight: 'normal',
          text: ve.bus_number.toString()
        }
      });
    });
  }

}
