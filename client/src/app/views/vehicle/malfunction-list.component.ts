import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { switchMap, share, take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { startOfToday } from 'date-fns';

import { ViewProfileState } from '../../states';
import { DataService } from '../../services';
import { SetProfile } from '../../actions';

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
    // this.alerts$ = this.dataService.getAlerts();
    // this.alerts$ = this.vcode$.pipe(
    //   switchMap(vcode => this.dataService.getVehicleMalfuncState(vcode)),
    //   share()
    // );
    this.alerts$ = this.vcode$.pipe(
      switchMap(vcode => this.dataService.getVehicleMalfuncStatesByDateRange(vcode, startOfToday(), new Date())),
      map((list: any[]) => list.slice(0, 14)),
      share()
    );
  }

  nav(vcode: string, time: string) {
    this.store.dispatch(new SetProfile(null, vcode, null, null));
    this.store.dispatch(new Navigate(
      ['vehicle/playback', vcode],
      { time: time}
    ));
  }
}
