import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { map, switchMap, share, tap } from 'rxjs/operators';

import { DataService, UtilityService } from '../../services';
import { ViewProfileState } from '../../states';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-spn-definition',
  templateUrl: './spn-definition.component.html',
  styleUrls: ['./spn-definition.component.scss']
})
export class SpnDefinitionComponent implements OnInit {
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
    const spnNo = selectedSpn.spn;
    const sourceType = selectedSpn.type;
    this.getSpn(spnNo, sourceType).subscribe(spn => {
      if (spn) {
        this.initForms(spn.StatusList.length);
        this.spnForm.setValue({
          SPNNo: spn.SPNNo,
          SPNName: spn.SPNName,
          PGNNo: spn.PGNNo,
          StartBit: spn.StartBit,
          Length: spn.Length,
          Resolution: spn.Resolution,
          Offset: spn.Offset,
          Unit: spn.Unit,
          LowerDataRange: spn.LowerDataRange,
          UpperDataRange: spn.UpperDataRange,
          StatusList: spn.StatusList
        });
      } else {
        this.initForms(0);
      }
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
    this.spnList$ = this.dataService.getDefinitions().pipe(
      switchMap(spns =>
          this.fcode$.pipe(
            map(fcode => spns.filter(spn => spn.fleet_code === fcode)),
            share()
        )
      )
    );
  }

  private getSpn(spnNo: string, sourceType: string): Observable<any> {
    if (sourceType === 'J1939') {
      const data$ = this.dataService.getSpnSpecs();
      return this.utilityService.getFlattedSPNSpecWithStatusArray(data$).pipe(
        map(spnList => spnList.find(spn => spn.SPNNo === spnNo))
      );
    } else {
      const data$ = this.dataService.getProprietarySpnList();
      return this.utilityService.getSPNListWithStatusArray(data$).pipe(
        map(spnList => spnList.find(spn => spn.SPNNo === spnNo))
      );
    }
  }

  private buildStatusForms(count: number): FormArray {
    const array = [];
    for (let i = 0; i < count; i++) {
      array.push(this.fb.group({
        status: [{value: '', disabled: true}],
        value: [{value: '', disabled: true}],
        enabled: [false]
      }));
    }

    return this.fb.array(array);
  }

  private initForms(statusCount: number) {
    this.spnForm = this.fb.group({
      SPNNo: [{value: '', disabled: true}],
      SPNName: [{value: '', disabled: true}],
      PGNNo: [{value: '', disabled: true}],
      StartBit: [{value: '', disabled: true}],
      Length: [{value: '', disabled: true}],
      Resolution: [{value: '', disabled: true}],
      Offset: [{value: '', disabled: true}],
      Unit: [{value: '', disabled: true}],
      LowerDataRange: [{value: '', disabled: true}],
      UpperDataRange: [{value: '', disabled: true}],
      StatusList: this.buildStatusForms(statusCount)
    });
  }
}

