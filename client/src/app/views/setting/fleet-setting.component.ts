import { Component, OnInit, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewProfileState } from '../../states';
import { DataService } from '../../services';
import { switchMap, share, map, tap } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-fleet-setting',
  templateUrl: './fleet-setting.component.html',
  styleUrls: ['./fleet-setting.component.scss']
})
export class FleetSettingComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  fleet$: Observable<any>;
  rootForm: FormGroup;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadData();
    this.initForm();
    this.loadForm();
  }

  private loadData() {
    this.fleet$ = this.fcode$.pipe(
      switchMap(fcode =>
        this.dataService.getFleets().pipe(
          map((fleets: any[]) =>
            fleets.find(fleet => fleet.code === fcode))
        )),
      share()
    );
  }

  private initForm() {
    this.rootForm = this.fb.group({
      code: null,
      name: null,
      icon: null,
      latitude: null,
      longitude: null,
      zoom: null,
      timezone: null,
      mode: null,
      address: null,
      phone: null,
      email: null,
      note: null,
      vehicles: this.fb.array([
        this.fb.group({
          code: null,
          vin: null,
          mac: null,
          picture: null,
          created: null,
          note: null
        })
      ])
    });
  }

  private loadForm() {
    const formData$ = this.fleet$.pipe(
      map(fleet => fleet ? this.buildFormData(fleet) : null),
      tap(x => console.log(x))
    );

    formData$.subscribe(data => data ?
      this.rootForm.setValue(data) : this.initForm());
  }

  private buildFormData(data: any): any {
    return {
      code: data.code,
      name: data.name,
      icon: data.icon,
      latitude: data.latitude,
      longitude: data.longitude,
      zoom: data.zoom,
      timezone: data.timezone,
      mode: data.mode,
      address: data.address,
      phone: data.phone,
      email: data.email,
      note: data.note,
      vehicles: this.filterVehicleFields(data.vehicles)
    };

  }

  private filterVehicleFields(vehicles: any[]) {
    return vehicles.map(v => {
      return {
        code: v.code,
        vin: v.vin,
        mac: v.mac,
        picture: v.picture,
        note: v.note,
        created: v.created
      };
    });
  }
}
