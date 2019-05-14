import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, } from '@angular/common/http';
import { Observable, forkJoin  } from 'rxjs';
// import { TransformUtility } from "fancycan-utility";

import { environment, } from '../../environments/environment';
import { share, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private rootUrl: string;
  private mongoApiHeader: HttpHeaders;
  private mongoUrl: string;

  constructor(
    // private transform: TransformUtility,
    private http: HttpClient
  ) {
    this.rootUrl = environment.firebase.databaseURL;
    this.mongoUrl = `${environment.mongodbAPI.url}/${environment.mongodbAPI.database}`;
    this.mongoApiHeader = new HttpHeaders().append('Authorization', environment.mongodbAPI.authToken);
  }

  getFleets(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/fleets.json`);
  }

  getRealtimeStates(): Observable<any> {
    return this.http
      .get<any>(`${this.rootUrl}/realtime-states.json`);
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

  getVehicleStates(fcode: string): Observable<any> {
    const params = new HttpParams().set('np', '').set('filter', `{'fcode': '${fcode}'}`);
    const headers = this.mongoApiHeader;
    return this.http
      .get<any>(`${this.mongoUrl}/vehicle_state`, { headers, params });
  }
  
  // getSpnProfile(fcode: string): Observable<any> {
  //     const defs$ = this.getDefinitions().pipe(
  //         map((defs: any[]) => defs.filter(def => def.fleet_code === fcode))
  //     );
  //     const spnsProp$ = this.getProprietarySpnList();
  //     const spnsJ1939$ = this.getSpnSpecs();
  //     return forkJoin(defs$, spnsProp$, spnsJ1939$).pipe(
  //           map(([defs, spnsProp, spnsJ1939]) => this.transform.getDefinitionWithSpecs(defs, spnsProp, spnsJ1939)),
  //     );
  // }

}
