import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

import { DataService, UtilityService } from '../../services';
import { ViewProfileState } from '../../states';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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

  get types(): FormArray {
    return this.entryForm.get('types') as FormArray;
  }

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForms();
    this.loadEntries();
  }

  selectEntry(selectedEntry: any) {
    this.entryForm.setValue({
      name: selectedEntry.name,
      spn: selectedEntry.spn,
      types: this.utilityService.getUsageTypeArray(selectedEntry.types)
    });
  }

  selectAll() {

  }

  deleteEntry() {

  }

  saveEntry() {

  }

  private loadEntries() {
    this.entryList$ = this.dataService.getUsageSetting().pipe(
      share(),
      switchMap(entries =>
          this.fcode$.pipe(
            map(fcode => entries.filter(entry => entry.fleet_code === fcode)),
        )
      )
    );
  }

  private initForms() {
    this.entryForm = this.fb.group({
      name: [''],
      spn: [''],
      types: this.utilityService.getDefaultUsage()
    });
  }
}

