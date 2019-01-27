import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { ViewProfileState } from '../../states';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';
import { DataService, UtilityService, TransformService } from '../../services';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  selectedDate = new Date();
  selectedTimeBegin = new Date();
  selectedTimeEnd = new Date();
  vehicleOpts$: Observable<IOption[]>;

  constructor(
    private dataService: DataService,
    // private utilityService: UtilityService
    private transformService: TransformService
  ) { }

  ngOnInit() {
    const fleets$ = this.dataService.getFleets();
    const vehicleProfiles$ = this.fcode$.pipe(
      switchMap(fcode =>
        this.transformService.getViewProfileByFleetCode(fcode, fleets$))
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

}
