import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FleetGuard implements CanActivate {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.storageService.watchViewProfile().pipe(
        map(profile => !!profile.fleet_code),
        tap(hasFleetCode => {
          if (!hasFleetCode) {
            console.error('need to choose a fleet');
            this.router.navigate(['/fleet']);
          }
        })
      );
  }
}