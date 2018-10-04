import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { navItems } from './../../_nav';
import { Observable } from 'rxjs';
import { ViewProfile, AppRouterStateSerializer, ViewProfileStateModel } from '../../models';
import { ViewProfileState } from '../../states';
import { ClearProfile } from '../../actions';

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
  }

  resetViewProfile() {
    this.store.dispatch(new ClearProfile());
  }
}
