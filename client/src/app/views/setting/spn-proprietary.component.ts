import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { map, switchMap, share } from 'rxjs/operators';

import { DataService } from '../../services';
import { ViewProfileState } from '../../states';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-spn-proprietary',
  templateUrl: './spn-proprietary.component.html',
  styleUrls: ['./spn-proprietary.component.scss']
})
export class SpnProprietaryComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  spnList$: Observable<any>;
  spnForm: FormGroup;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForms();
    this.loadSpnList();
  }

  selectSpn(selectedSpn: any) {
    this.spnForm.patchValue({
      SPNNo: selectedSpn.SPNNo,
      SPNName: selectedSpn.SPNName,
      PGNNo: selectedSpn.PGNNo
    });
    // this.spnForm.setValue(selectedSpn);
  }

  private loadSpnList() {
    this.spnList$ = this.dataService.getProprietarySpnList().pipe(
      switchMap(spns =>
          this.fcode$.pipe(
            map(fcode => spns.filter(spn => spn.fleet_code === fcode)),
            share()
        )
      )
    );
  }

  private initForms() {
    this.spnForm = this.fb.group({
      SPNNo: [''],
      SPNName: [''],
      PGNNo: ['']
    });

  }
}

