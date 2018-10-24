import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

import { DataService, UtilityService } from '../../services';
import { ViewProfileState } from '../../states';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
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
    private utilityService: UtilityService,
  ) { }

  ngOnInit() {
    this.initForms();
    this.loadEntries();
  }

  selectEntry(selectedEntry: any) {
    this.entry = {
      name: selectedEntry.name,
      spn: selectedEntry.spn,
      types: this.utilityService.getUsageTypeArray(selectedEntry.types)
    };
    this.buildFormControls();
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
    this.entry = this.GetDefaultEntry();
    this.buildFormControls();
  }

  private GetDefaultEntry(): any {
    return {
      name: '',
      spn: '',
      types: this.utilityService.getDefaultUsage()
    };
  }

  private buildFormControls() {
    this.entryForm = new FormGroup({});
    this.entryForm.addControl('name', new FormControl(this.entry.name));
    this.entryForm.addControl('spn', new FormControl(this.entry.spn));
    this.entry.types.forEach((type, i) => {
      this.entryForm.addControl(type.name, new FormControl(type.checked));
    });
  }
}

