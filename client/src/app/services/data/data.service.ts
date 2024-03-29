import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable  } from 'rxjs';

import { environment, DataSourceType } from '../../../environments/environment';
import { share, map } from 'rxjs/operators';
import { ObjectID } from 'bson';

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

  getCansByDateRange(vcode: string, beginDate: Date, endDate: Date): Observable<any> {
    const beginID =  ObjectID.createFromTime(beginDate.getTime() / 1000);
    const endID =  ObjectID.createFromTime(endDate.getTime() / 1000);
    const params = new HttpParams().append('np', '')
      .append('filter', `{'remotePort': ${vcode}}`)
      .append('filter', `{'_id':{'$gte':{'$oid': '${beginID.toString()}'}}}`)
      .append('filter', `{'_id':{'$lt':{'$oid': '${endID.toString()}'}}}`)
      .append('pagesize', '1000');
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/can`, { headers, params });
  }

  // getCanStatesByDateRange(vcode: string, beginDate: Date, endDate: Date): Observable<any> {
  //   const params = new HttpParams().set('np', '')
  //     .set('filter', `{'vcode': '${vcode}'}`)
  //     .set('filter', `{'createDate':{'$gte':{'$date': '${beginDate.toISOString()}'}}}`)
  //     .set('filter', `{'createDate':{'$lt':{'$date': '${endDate.toISOString()}'}}}`)
  //     .set('pagesize', '1000');
  //   const headers = this.mongoApiHeader;
  //   return this.http
  //     .get<any>(`${this.mongoUrl}/can`, { headers, params });
  // }

  getVehicleMalfuncState(vcode: string): Observable<any> {
    const params = new HttpParams().append('np', '').append('filter', `{'vcode': '${vcode}'}`);
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/vehicle_malfunc_state`, { headers, params });
  }

  getVehicleMalfuncStatesByLatestN(vcode: string, latestN: number): Observable<any> {
    const params = new HttpParams().append('np', '')
      .append('filter', `{'vcode': '${vcode}'}`)
      .append('count', '').set('page', '1').set('pagesize', latestN.toString());
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/vehicle_malfunc_state`, { headers, params });
  }

  getVehicleMalfuncStatesByDateRange(vcode: string, beginDate: Date, endDate: Date): Observable<any> {
    const beginID =  ObjectID.createFromTime(beginDate.getTime() / 1000);
    const endID =  ObjectID.createFromTime(endDate.getTime() / 1000);
    const params = new HttpParams().append('np', '')
      .append('filter', `{'vcode': '${vcode}'}`)
      .append('filter', `{'_id':{'$gte':{'$oid': '${beginID.toString()}'}}}`)
      .append('filter', `{'_id':{'$lt':{'$oid': '${endID.toString()}'}}}`)
      .append('keys', `{'vcode':1,'malfuncID':1, 'malfuncName':1, 'malfuncSpns':1, 'malfuncLevel':1,'createDate':1}`)
      .append('pagesize', '1000');
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
