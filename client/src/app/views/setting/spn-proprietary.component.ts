import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { map, switchMap, share, tap } from 'rxjs/operators';

import { DataService, UtilityService } from '../../services';
import { ViewProfileState } from '../../states';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-spn-proprietary',
  templateUrl: './spn-proprietary.component.html',
  styleUrls: ['./spn-proprietary.component.scss']
})
export class SpnProprietaryComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  spnList$: Observable<any[]>;
  spnForm: FormGroup;

  get statusList(): FormArray {
    return this.spnForm.get('StatusList') as FormArray;
  }

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForms(0);
    this.loadSpnList();
  }

  selectSpn(selectedSpn: any) {
    this.initForms(selectedSpn.StatusList.length);
    this.spnForm.setValue({
      SPNNo: selectedSpn.SPNNo,
      SPNName: selectedSpn.SPNName,
      PGNNo: selectedSpn.PGNNo,
      StartBit: selectedSpn.StartBit,
      Length: selectedSpn.Length,
      Resolution: selectedSpn.Resolution,
      Offset: selectedSpn.Offset,
      Unit: selectedSpn.Unit,
      LowerDataRange: selectedSpn.LowerDataRange,
      UpperDataRange: selectedSpn.UpperDataRange,
      StatusList: selectedSpn.StatusList
    });
  }

  selectAll() {
    this.spnList$.pipe(
      map(spnList => {
        return spnList.map(spn => spn.selected = true);
      })
    );
  }

  deleteSpn() {

  }

  saveSpn() {

  }

  private loadSpnList() {
    const data$ = this.dataService.getProprietarySpnList();
    this.spnList$ = this.utilityService.getSPNListWithStatusArray(data$).pipe(
      switchMap(spns =>
          this.fcode$.pipe(
            map(fcode => spns.filter(spn => spn.fleet_code === fcode)),
            share()
        )
      )
    );
  }

  private buildStatusForms(count: number): FormArray {
    const array = [];
    for (let i = 0; i < count; i++) {
      array.push(this.fb.group({
        status: [''],
        value: [''],
        enabled: [false]
      }));
    }

    return this.fb.array(array);
  }

  private initForms(statusCount: number) {
    this.spnForm = this.fb.group({
      SPNNo: [''],
      SPNName: [''],
      PGNNo: [''],
      StartBit: [''],
      Length: [''],
      Resolution: [''],
      Offset: [''],
      Unit: [''],
      LowerDataRange: [''],
      UpperDataRange: [''],
      StatusList: this.buildStatusForms(statusCount)
    });
  }
}

