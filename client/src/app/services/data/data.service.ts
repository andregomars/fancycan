import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';


import { environment, DataSourceType } from '../../../environments/environment';
import { share, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sourceType: DataSourceType;
  private rootUrl: string;
  private mongoUrl: string;
  private mongoApiHeader: HttpHeaders;
  private delayEmulatorTimer: number;
  private tooltips$: Observable<any>;


  constructor(
    private http: HttpClient
  ) {
    this.sourceType = environment.dataSource;
    this.delayEmulatorTimer = environment.delayEmulatorTimer;
    this.mongoUrl = `${environment.mongodbAPI.url}/${environment.mongodbAPI.database}`;
    this.mongoApiHeader = new HttpHeaders().append('Authorization', environment.mongodbAPI.authToken);

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

  getFleets(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/fleets.json`);
  }

  getRealtimeStates(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/realtime-states.json`);
  }

  getVehicleStates(fcode: string): Observable<any> {
    const params = new HttpParams().set('np', '').set('filter', `{'fcode': '${fcode}'}`);
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/vehicle_state`, { headers, params });
  }

  getVehicleState(vcode: string): Observable<any> {
    const params = new HttpParams().set('np', '').set('filter', `{'vcode': '${vcode}'}`);
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/vehicle_state`, { headers, params });
  }

  getCanStatesByDateRange(vcode: string, beginDate: Date, endDate: Date): Observable<any> {
    const params = new HttpParams().set('np', '')
      .set('filter', `{'vcode': '${vcode}'}`)
      .set('filter', `{'createDate':{'$gte':{'$date': '${beginDate}'}}}`)
      .set('filter', `{'createDate':{'$lt':{'$date': '${endDate}'}}}`)
      .set('pagesize', '1000');
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/can`, { headers, params });
  }

  getVehicleMalfuncState(vcode: string): Observable<any> {
    const params = new HttpParams().set('np', '').set('filter', `{'vcode': '${vcode}'}`);
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/vehicle_malfunc_state`, { headers, params });
  }

  getVehicleMalfuncStateByLatestN(vcode: string, latestN: number): Observable<any> {
    const params = new HttpParams().set('np', '')
      .set('filter', `{'vcode': '${vcode}'}`)
      .set('count', '').set('page', '1').set('pagesize', latestN.toString());
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/vehicle_malfunc_state`, { headers, params });
  }



  getAlertStats(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/alert-stats.json`);
  }

  getAlerts(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/alerts.json`);
  }

  getFleetStats(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/fleet-stats.json`);
  }

  getVehicleStats(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/vehicle-stats.json`);
  }

  getDefinitions(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/definitions.json`);
  }

  getDecodes(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/decodes.json`);
  }

  getSpnSpecs(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/j1939spn.json`);
  }

  getProprietarySpnList(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/proprietary-spn.json`);
  }

  getUsageSetting(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/usage-setting.json`);
  }

  getMalfunctionSetting(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/malfunction-setting.json`);
  }

  getCANs(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/cans.json`);
  }

  getVehicleTemplate(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/vehicle-template.json`);
  }

  getChecklistSetting(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/checklist-setting.json`);
  }

  getChecklist(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/checklist.json`);
  }

  getUsers(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/users.json`);
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

  getToolTip(label: string, path?: string): Observable<string> {
    this.getToolTips();
    return this.tooltips$.pipe(
      map(tips => {
        let found: any;
        if (path && path.length > 0) {
          found = tips.find(tip =>
            tip.label.toString().toLowerCase() === label.toLowerCase() && tip.path === path);
        } else {
          found = tips.find(tip => tip.label.toString().toLowerCase() === label.toLocaleLowerCase());
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
