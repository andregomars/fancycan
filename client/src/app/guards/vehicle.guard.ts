import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { ViewProfileState } from '../states';

@Injectable({
  providedIn: 'root'
})
export class VehicleGuard implements CanActivate {
  @Select(ViewProfileState.vcode) vcode$: Observable<string>;

  constructor(
    private store: Store
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.vcode$.pipe(
        tap(vcode => {
          const navTo = !!vcode ? [state.url, vcode] : ['/vehicle/list'];
          this.store.dispatch(new Navigate(navTo));
        }),
        map(vcode => !!vcode)
      );
  }
}
