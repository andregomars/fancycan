import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewProfileState } from '../../states';
import { switchMap, map, share } from 'rxjs/operators';
import { DataService, UtilityService } from '../../services';
import { IOption } from 'ng-select';

@Component({
  selector: 'app-checklist-log',
  templateUrl: './checklist-log.component.html',
  styleUrls: ['./checklist-log.component.scss']
})
export class ChecklistLogComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  checklist$: Observable<any>;
  vehicleOpts$: Observable<IOption[]>;
  selectedDate = new Date();

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadVehicleList();
  }

  private loadVehicleList() {
    const fleets$ = this.dataService.getFleets();
    const vehicleProfiles$ = this.fcode$.pipe(
      switchMap(fcode =>
        this.utilityService.getVehiclesByFleetCode(fcode, fleets$))
    );
    this.vehicleOpts$ = vehicleProfiles$.pipe(
      map(profiles => profiles.map(profile => {
        return {
          label: profile.vcode,
          value: profile.vcode
        } as IOption;
      }))
    );
  }

  loadChecklist($event: any) {
    this.checklist$ =
      this.dataService.getChecklist().pipe(
        map((items: any[]) =>
          items.filter(item => item.vehicle_code === $event.value)),
        share()
      );
  }
}
