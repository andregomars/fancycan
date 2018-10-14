import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { map, switchMap, share, tap } from 'rxjs/operators';

import { DataService, UtilityService } from '../../services';
import { ViewProfileState } from '../../states';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-malfunction-setting',
  templateUrl: './malfunction-setting.component.html',
  styleUrls: ['./malfunction-setting.component.scss']
})
export class MalfunctinoSettingComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  entryList$: Observable<any[]>;
  entryForm: FormGroup;

  get conditions(): FormArray {
    return this.entryForm.get('conditions') as FormArray;
  }

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForms(0);
    this.loadConditionList();
  }

  selectEntry(selectedEntry: any) {
    this.initForms(selectedEntry.conditions.length);
    this.entryForm.setValue({
      name: selectedEntry.name,
      gpslat: selectedEntry.name,
      gpslgt: selectedEntry.name,
      gpsexpression: selectedEntry.name,
      gpsvalue: selectedEntry.name,
      notification: selectedEntry.name,
      conditions: selectedEntry.conditions
    });
  }

  selectAll() {

  }

  deleteSpn() {

  }

  saveSpn() {

  }

  private loadConditionList() {
    this.entryList$ = this.dataService.getMalfunctionSetting();
    // this.entryList$ = this.utilityService.getSPNListWithStatusArray(data$).pipe(
    //   switchMap(spns =>
    //       this.fcode$.pipe(
    //         map(fcode => spns.filter(spn => spn.fleet_code === fcode)),
    //         share()
    //     )
    //   )
    // );
  }

  private buildConditionForms(count: number): FormArray {
    const array = [];
    for (let i = 0; i < count; i++) {
      array.push(this.fb.group({
        condition: [''],
        expression: [''],
        value: [''],
      }));
    }

    return this.fb.array(array);
  }

  private initForms(conditionsCount: number) {
    this.entryForm = this.fb.group({
      name: [''],
      gpslat: [''],
      gpslgt: [''],
      gpsexpression: [''],
      gpsvalue: [''],
      notification: [''],
      conditions: this.buildConditionForms(conditionsCount)
    });
  }
}

