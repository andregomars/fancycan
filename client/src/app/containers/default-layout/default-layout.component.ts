import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RouterState } from '@ngxs/router-plugin';
import { Observable } from 'rxjs';

import { navItems } from './../../_nav';
import { AppRouterStateSerializer } from '../../models';
import { ViewProfileState } from '../../states';
import { ClearProfile, SetProfile } from '../../actions';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  navItems = navItems;
  sidebarMinimized = true;
  element: HTMLElement = document.body;
  // @Select(RouterState.url) url$: Observable<string>;
  // @Select(RouterState.state) route$: Observable<AppRouterStateSerializer>;
  // @Select(ViewProfileState) viewProfile$: Observable<ViewProfileStateModel>;
  @Select(RouterState.state) route$: Observable<AppRouterStateSerializer>;
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  @Select(ViewProfileState.vcode) vcode$: Observable<string>;
  private changes: MutationObserver;

  constructor(
    private store: Store
  ) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  ngOnInit() {
    this.setViewPofileByUrl();
  }

  resetViewProfile() {
    this.store.dispatch(new ClearProfile());
  }

  private setViewPofileByUrl() {
    this.route$.pipe(
      map(route => {
        return {
          fcode: route['params']['fcode'],
          vcode: route['params']['vcode']
        };
      }),
      tap(param => this.store.dispatch(new SetProfile(param.fcode, param.vcode)))
    ).subscribe();
  }
}
