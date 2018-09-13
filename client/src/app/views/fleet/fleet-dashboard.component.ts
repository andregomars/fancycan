import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { share, map, tap, debounce } from 'rxjs/operators';

import { DataService } from '../../services';
import { MapStyle } from './../shared/map-style';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fleet-dashboard',
  templateUrl: './fleet-dashboard.component.html',
  styleUrls: ['./fleet-dashboard.component.scss']
})
export class FleetDashboardComponent implements OnInit {
  hideSideInfo: boolean;

  loadMap = environment.loadMap;
  mapMinHeight = 768;
  mapZoom = 12;
  mapStyle = new MapStyle().styler;
  vehicles$: Observable<any>;
  filteredVehicles$: Observable<any>;
  bus_number: string;
  map_lat = 34.056539;
  map_lgt = -118.237485;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.hideSideInfo = false;
    this.loadData();
    this.filteredVehicles$ = this.vehicles$;
  }

  filterVehicles(busno: string) {
      if (!busno || busno.length === 0) {
        this.loadData();
        this.filteredVehicles$ = this.vehicles$;
        return;
      }

      this.filteredVehicles$ = this.vehicles$.pipe(
        debounce(() => timer(300)),
        map(vehicles =>
          vehicles.filter(v => v.bus_number.toString().toUpperCase().indexOf(busno.trim().toUpperCase()) > -1)
        ),
      );
  }

  resizeSideInfo() {
    this.hideSideInfo = !this.hideSideInfo;
  }

  private loadData() {
    this.vehicles$ = this.dataService.getVehicles().pipe(
      map(vehicles => this.attachMapLabel(vehicles)),
      share()
    );
  }

  private attachMapLabel(vehicles: any): any {
    return vehicles.map(ve => {
      return Object.assign(ve, {
        label: {
          color: '#ffffff',
          fontFamily: '',
          fontSize: '9px',
          fontWeight: 'normal',
          text: ve.bus_number.toString()
        }
      });
    });
  }

}
