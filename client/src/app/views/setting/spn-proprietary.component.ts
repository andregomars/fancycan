import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProprietarySpnState } from '../../states';
import { ProprietarySpnStateModel } from '../../models';
import { Observable } from 'rxjs';
import { InitProprietarySpnList } from '../../actions';

@Component({
  selector: 'app-spn-proprietary',
  templateUrl: './spn-proprietary.component.html',
  styleUrls: ['./spn-proprietary.component.scss']
})
export class SpnProprietaryComponent implements OnInit {
  @Select(ProprietarySpnState.spnList) spnList$: Observable<any>;
  @Select(ProprietarySpnState) state$: Observable<ProprietarySpnStateModel>;

  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    this.store.dispatch(new InitProprietarySpnList('LAMTA'));
  }

}
