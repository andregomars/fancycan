import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ViewProfileState } from '../../states';
import { DataService, UtilityService } from '../../services';
import { switchMap, map, share, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-checklist-setting',
  templateUrl: './checklist-setting.component.html',
  styleUrls: ['./checklist-setting.component.scss']
})
export class ChecklistSettingComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  entries$: Observable<any[]>;
  rootForm: FormGroup;
  checkTypeOptions = ['status', 'value', 'condition'];
  context = { message: 'test' };

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadData();
    this.initForm(0);
    this.loadForm();
  }

  private loadData() {
    this.entries$ = this.fcode$.pipe(
      switchMap(fcode =>
        this.dataService.getChecklistSetting().pipe(
          map((entries: any[]) =>
            entries.filter(fleet => fleet.fleet_code === fcode)),
          map(entries =>
            entries.map(entry => {
              const qrCode =
                this.utilityService.buildQrCode(entry.fleet_code,
                  entry.item, entry.location);
              return { ...entry, qrcode: qrCode };
            })
          )
        )),
      share()
    );
  }

  private loadForm() {
    const formData$ = this.entries$.pipe(
      map(entries => entries ? this.buildFormData(entries) : null)
    );

    formData$.subscribe(data => {
      if (data && data.entries) {
        this.initForm(data.entries.length);
        this.rootForm.setValue(data);
      } else {
        this.initForm(0);
      }
    });
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

  private initForm(entryCounts: number) {
    const entries = Array.from(Array(entryCounts).keys()).map(() =>
      this.fb.group({
        item: null,
        location: null,
        // type: null,
        type: this.buildSelectionForms(this.checkTypeOptions),
        picture: null,
        qrcode: null,
        note: null
      }));
    this.rootForm = this.fb.group({
      entries: this.fb.array(entries)
    });
  }

  private buildFormData(data: any[]): any {
    const entries = data.map(e => {
      return {
        item: e.item,
        location: e.location,
        type: this.utilityService.convertSelectOptions(this.checkTypeOptions, e.type),
        picture: e.picture,
        qrcode: e.qrcode,
        note: e.note
      };
    });

    return {
      entries: entries
    };
  }

}

