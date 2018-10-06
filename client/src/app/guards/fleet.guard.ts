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
export class FleetGuard implements CanActivate {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;

  constructor(
    private store: Store
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.fcode$.pipe(
        tap(fcode => {
          const navTo = !!fcode ? [state.url, fcode] : ['/fleet/list'];
          this.store.dispatch(new Navigate(navTo));
        }),
        map(fcode => !!fcode)
      );
  }
}
