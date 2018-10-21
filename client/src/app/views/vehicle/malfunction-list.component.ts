import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ViewProfileState } from '../../states';
import { Observable } from 'rxjs';
import { DataService } from '../../services';
import { SetProfile } from '../../actions';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-malfunction-list',
  templateUrl: './malfunction-list.component.html',
  styleUrls: ['./malfunction-list.component.scss']
})
export class MalfunctionListComponent implements OnInit {
  @Select(ViewProfileState.vcode) vcode$: Observable<string>;
  alerts$: Observable<any>;

  constructor(
    private store: Store,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.alerts$ = this.dataService.getAlerts();
  }

  nav(fcode: string, vcode: string, time: string) {
    this.store.dispatch(new SetProfile(fcode, vcode));
    this.store.dispatch(new Navigate(
      ['vehicle/playback', vcode],
      { time: time}
    ));
  }
}
