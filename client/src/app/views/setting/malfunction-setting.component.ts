import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

import { DataService, UtilityService } from '../../services';
import { ViewProfileState } from '../../states';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-malfunction-setting',
  templateUrl: './malfunction-setting.component.html',
  styleUrls: ['./malfunction-setting.component.scss']
})
export class MalfunctinoSettingComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  entryList$: Observable<any[]>;
  entryForm: FormGroup;
  expressionOptions = ['>', '=', '<', '!='];
  notificationOptions = ['email', 'app'];

  get conditions(): FormArray {
    return this.entryForm.get('conditions') as FormArray;
  }

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForms(2);
    this.loadEntries();
  }

  selectEntry(selectedEntry: any) {
    this.initForms(selectedEntry.conditions.length);
    this.entryForm.setValue({
      name: selectedEntry.name,
      gpslat: selectedEntry.gpslat,
      gpslgt: selectedEntry.gpslgt,
      gpsexpression: selectedEntry.gpsexpression,
      gpsvalue: selectedEntry.gpsvalue,
      notification: this.utilityService.convertSelectOptions(
        this.notificationOptions,
        selectedEntry.notification),
      conditions: selectedEntry.conditions
    });
  }

  getSpns(conditions: any[]): string {
    if (conditions && conditions.length > 0) {
      return conditions.map(el => el.spn).join(',');
    } else {
      return '';
    }
  }

  selectAll() {

  }

  deleteEntry() {

  }

  saveEntry() {
    console.log(this.entryForm.value);
  }

  private loadEntries() {
    this.entryList$ = this.dataService.getMalfunctionSetting().pipe(
      switchMap(entries =>
          this.fcode$.pipe(
            map(fcode => entries.filter(entry => entry.fleet_code === fcode)),
        )
      )
    );
  }

  private buildSelectionForms(options: string[]): FormArray {
    const array = options.map(opt => {
      return this.fb.group({
        name: opt,
        selected: false
      });
    });

    return this.fb.array(array);
  }


  private buildConditionForms(count: number): FormArray {
    const array = [];
    for (let i = 0; i < count; i++) {
      array.push(this.fb.group({
        spn: [''],
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
      notification: this.buildSelectionForms(this.notificationOptions),
      conditions: this.buildConditionForms(conditionsCount)
    });
  }
}

