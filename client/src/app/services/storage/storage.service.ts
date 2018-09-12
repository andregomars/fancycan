import { Injectable } from '@angular/core';
import { Observable, pipe, Subject, BehaviorSubject } from 'rxjs';
import { ViewProfile } from '../../model';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
    private viewProfile$: BehaviorSubject<ViewProfile>;

    constructor() {
        this.viewProfile$ = new BehaviorSubject<ViewProfile>({
            fleet_code: null,
            vehicle_code: null
        });
    }

    watchViewProfile(): Observable<ViewProfile> {
        return this.viewProfile$.asObservable();
    }

    setViewProfile(viewProfile: ViewProfile) {
        this.viewProfile$.next(viewProfile);
    }

    clearViewProfile() {
        this.viewProfile$.next({ fleet_code: null, vehicle_code: null});
    }

}