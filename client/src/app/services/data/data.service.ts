import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';


import { environment, DataSourceType } from '../../../environments/environment';
import { share, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sourceType: DataSourceType;
  private rootUrl: string;
  private delayEmulatorTimer: number;
  private tooltips$: Observable<any>;


  constructor(
    private http: HttpClient
  ) {
    this.sourceType = environment.dataSource;
    this.delayEmulatorTimer = environment.delayEmulatorTimer;


    switch (this.sourceType) {
      case (DataSourceType.Firebase):
        this.rootUrl = environment.firebase.databaseURL;
        break;
      default:
        this.delayEmulatorTimer = environment.delayEmulatorTimer;
        this.rootUrl = environment.apiRootLocal;
        break;
    }
  }

  getVehicles(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/vehicles.json`);
  }

  getAlerts(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/alerts.json`);
  }

  getDefinitions(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/definitions.json`);
  }

  getToolTips(): Observable<any> {
    if (this.tooltips$) {
      return this.tooltips$;
    } else {
      this.tooltips$ = this.http
        .get<any>(`${this.rootUrl}/tooltips.json`).pipe(
          share()
        );
    }
  }

  getToolTip(name: string, path?: string): Observable<string> {
    this.getToolTips();
    return this.tooltips$.pipe(
      map(tips => {
        let found: any;
        if (path && path.length > 0) {
          found = tips.find(tip => tip.name === name && tip.path === path);
        } else {
          found = tips.find(tip => tip.name === name);
        }

        if (found) {
          return found.description;
        } else {
          return '';
        }
      })
    );
  }
}
