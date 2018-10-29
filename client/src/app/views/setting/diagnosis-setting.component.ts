import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ViewProfileState } from '../../states';
import { DataService } from '../../services';
import { switchMap, map, share, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-diagnosis-setting',
  templateUrl: './diagnosis-setting.component.html',
  styleUrls: ['./diagnosis-setting.component.scss']
})
export class DiagnosisSettingComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  entries$: Observable<any[]>;
  rootForm: FormGroup;

  constructor(
    private dataService: DataService,
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
        this.dataService.getDiagnosisSetting().pipe(
          map((entries: any[]) =>
            entries.filter(fleet => fleet.fleet_code === fcode))
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


  private initForm(entryCounts: number) {
    const entries = Array.from(Array(entryCounts).keys()).map(() =>
      this.fb.group({
        item: null,
        location: null,
        type: null,
        picture: null,
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
        type: e.type,
        picture: e.picture,
        note: e.note
      };
    });

    return {
      entries: entries
    };
  }

}

