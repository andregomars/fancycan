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
        map(vcode => !!vcode),
        tap(vcode => {
          const navTo = !!vcode ? [state.url, vcode] : ['/vehicle/list'];
          this.store.dispatch(new Navigate(navTo));
        })
      );
      // return this.storageService.watchViewProfile().pipe(
      //   tap(profile => {
      //     if (profile && profile.vehicle_code) {
      //       this.router.navigate([state.url, profile.vehicle_code]);
      //     } else {
      //       console.error('need to choose a vehicle');
      //       this.router.navigate(['/vehicle/list']);
      //     }
      //   }),
      //   map(profile => !!profile.vehicle_code)
      // );
  }
}
