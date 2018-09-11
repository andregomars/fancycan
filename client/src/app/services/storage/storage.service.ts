import { Injectable } from '@angular/core';
import { Observable, pipe, Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
    private fcode$ = new BehaviorSubject<string>('');

    watchFcode(): Observable<string> {
        return this.fcode$.asObservable();
    }

    setFcode(fcode: string) {
        this.fcode$.next(fcode);
    }

    removeFcode() {
        this.fcode$.next('');
    }

}
