import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

import { DataService } from '../../services';
import { ViewProfileState } from '../../states';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { map, switchMap, share } from 'rxjs/operators';

@Component({
  selector: 'app-usage-setting',
  templateUrl: './usage-setting.component.html',
  styleUrls: ['./usage-setting.component.scss']
})
export class UsageSettingComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  entryList$: Observable<any[]>;
  entryForm: FormGroup;
  entry: any;

  get types(): FormArray {
    return this.entryForm.get('types') as FormArray;
  }

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadEntries();
    this.buildFormControls();
  }

  selectEntry(selectedEntry: any) {
    const types = this.getTypesOfChecked(selectedEntry.type);
    const entryData = {
      name: selectedEntry.name,
      spn: selectedEntry.spn,
      types: types
    };
    this.entryForm.setValue(entryData);
  }

  selectAll() {

  }

  deleteEntry() {

  }

  saveEntry() {

  }

  private loadEntries() {
    this.entryList$ = this.dataService.getUsageSetting().pipe(
      switchMap(entries =>
          this.fcode$.pipe(
            map(fcode => entries.filter(entry => entry.fleet_code === fcode)),
        )
      )
    );
  }

  private buildFormControls() {
    const usages = this.getDefaultUsage();
    this.entryForm = this.fb.group({
      name: '' ,
      spn: '',
      types: this.buildUsageTypeForms(usages)
    });
  }

  private buildUsageTypeForms(options: any[]): FormArray {
    const array = options.map(opt => {
      return this.fb.group({
        name: opt.name,
        value: opt.value,
        hint: opt.hint,
        checked: opt.checked
      });
    });

    return this.fb.array(array);
  }

  private getTypesOfChecked(type: string): any[] {
    const types = this.getDefaultUsage();
    return types.map(item => {
      return {
        name: item.name,
        value: item.value,
        hint: item.hint,
        checked: item.value === type
      };
    });
  }

  getDefaultUsage(): any[] {
        return [
            {
                name: 'Usage Times',
                value: 'times',
                hint: 'For Door, Wiper, Ramp, HVAC, etc.',
                checked: false
            },
            {
                name: 'Usage time',
                value: 'time',
                hint: 'For Engine, HVAC, etc.',
                checked: false
            },
            {
                name: 'Cumulative',
                value: 'cumulative',
                hint: 'For Odometer, etc.',
                checked: false
            },
            {
                name: 'Increment',
                value: 'increment',
                hint: 'For Re-gen, etc.',
                checked: false
            },
            {
                name: 'Decrement',
                value: 'decrement',
                hint: 'For Energy usage, etc',
                checked: false
            }
        ];
    }
}

