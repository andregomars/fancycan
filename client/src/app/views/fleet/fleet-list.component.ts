import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { DataService } from '../../services';
import { SetProfile } from '../../actions';

@Component({
  selector: 'app-fleet-list',
  templateUrl: './fleet-list.component.html',
  styleUrls: ['./fleet-list.component.scss']
})
export class FleetListComponent implements OnInit {
  fleets$: Observable<any>;

  constructor(
    private dataService: DataService,
    private store: Store
  ) { }

  ngOnInit() {
    this.loadData();
  }

  nav(fcode: string) {
    this.store.dispatch(new SetProfile(fcode, null, null, null));
    this.store.dispatch(new Navigate(['/fleet/dashboard', fcode]));
  }

  private loadData() {
    this.fleets$ = this.dataService.getFleets().pipe(
      share()
    );
  }
}
