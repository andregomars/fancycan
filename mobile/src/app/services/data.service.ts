import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, } from '@angular/common/http';
import { Observable, forkJoin, of  } from 'rxjs';
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

    getSpnProfile(fcode: string): Observable<any> {
      const defs = [{"SPNNo":84,"SPNName":"Wheel-Based Vehicle Speed","PGNNo":65265,"PGNName":"Cruise Control/Vehicle Speed","StartByte":3,"StartBit":1,"Length":16,"Resolution":0.00242956061,"Offset":0,"Unit":"mph","LowerDataRange":0,"UpperDataRange":156},{"SPNNo":190,"SPNName":"Engine Speed","PGNNo":61444,"PGNName":"Electronic Engine Controller 1","StartByte":4,"StartBit":1,"Length":16,"Resolution":0.125,"Offset":0,"Unit":"rpm","LowerDataRange":0,"UpperDataRange":8031.875},{"SPNNo":584,"SPNName":"Latitude","PGNNo":65267,"PGNName":"Vehicle Position","StartByte":1,"StartBit":1,"Length":32,"Resolution":1e-7,"Offset":-210,"Unit":"deg","LowerDataRange":-210,"UpperDataRange":211},{"SPNNo":585,"SPNName":"Longitude","PGNNo":65267,"PGNName":"Vehicle Position","StartByte":5,"StartBit":1,"Length":32,"Resolution":1e-7,"Offset":-210,"Unit":"deg","LowerDataRange":-210,"UpperDataRange":211},{"SPNNo":917,"SPNName":"High Resolution Total Vehicle Distance","PGNNo":65217,"PGNName":"High Resolution Vehicle Distance","StartByte":1,"StartBit":1,"Length":32,"Resolution":5,"Offset":0,"Unit":"m","LowerDataRange":0,"UpperDataRange":21055405},{"SPNNo":9000,"SPNName":"State Of Charge","PGNNo":64519,"PGNName":"SOC","StartByte":5,"StartBit":1,"Length":16,"Resolution":0.1,"Offset":0,"Unit":"%","LowerDataRange":0,"UpperDataRange":100,"Status":{"Name":""}},{"SPNNo":9001,"SPNName":"Battery Energy","PGNNo":64527,"PGNName":"Battery Energy","StartByte":6,"StartBit":1,"Length":16,"Resolution":0.1,"Offset":0,"Unit":"kWh","LowerDataRange":0,"UpperDataRange":500,"Status":{"Name":""}},{"SPNNo":9002,"SPNName":"Battery Voltage","PGNNo":64520,"PGNName":"Voltage and Current","StartByte":1,"StartBit":1,"Length":16,"Resolution":1,"Offset":0,"Unit":"V","LowerDataRange":0,"UpperDataRange":800,"Status":{"Name":""}},{"SPNNo":9003,"SPNName":"Battery Current","PGNNo":64520,"PGNName":"Voltage and Current","StartByte":3,"StartBit":1,"Length":16,"Resolution":0.1,"Offset":-1000,"Unit":"A","LowerDataRange":-300,"UpperDataRange":300,"Status":{"Name":""}},{"SPNNo":9004,"SPNName":"Motor Voltage","PGNNo":64534,"PGNName":"Motor Voltage","StartByte":5,"StartBit":1,"Length":16,"Resolution":1,"Offset":0,"Unit":"V","LowerDataRange":0,"UpperDataRange":800,"Status":{"Name":""}},{"SPNNo":9005,"SPNName":"L-C Battery Temp","PGNNo":64523,"PGNName":"Battery Temperature","StartByte":3,"StartBit":1,"Length":8,"Resolution":1.8,"Offset":-40,"Unit":"F","LowerDataRange":0,"UpperDataRange":220,"Status":{"Name":""}},{"SPNNo":9006,"SPNName":"H-C Battery Temp","PGNNo":64523,"PGNName":"Battery Temperature","StartByte":7,"StartBit":1,"Length":8,"Resolution":1.8,"Offset":-40,"Unit":"F","LowerDataRange":0,"UpperDataRange":220,"Status":{"Name":""}},{"SPNNo":9007,"SPNName":"High Voltage Status","PGNNo":64516,"PGNName":"High Voltage","StartByte":2,"StartBit":1,"Length":2,"Resolution":1,"Offset":0,"Unit":"bit","LowerDataRange":0,"UpperDataRange":3,"Status":{"Description":["Disable","Enable","Reserved"],"Name":"Enable"}},{"SPNNo":9008,"SPNName":"Left Charge Status","PGNNo":64538,"PGNName":"Left Charge","StartByte":1,"StartBit":3,"Length":4,"Resolution":1,"Offset":0,"Unit":"bit","LowerDataRange":0,"UpperDataRange":10,"Status":{"Description":["Disconnected","Connected","Charging","Charging Stop","Charging Complete","Charging Error"],"Name":"Enable"}},{"SPNNo":9009,"SPNName":"Right Charge Status","PGNNo":64537,"PGNName":"Right Charge","StartByte":1,"StartBit":3,"Length":4,"Resolution":1,"Offset":0,"Unit":"bit","LowerDataRange":0,"UpperDataRange":10,"Status":{"Description":["Disconnected","Connected","Charging","Charging Stop","Charging Complete","Charging Error"],"Name":"Enable"}},{"SPNNo":9010,"SPNName":"Front Door Status","PGNNo":64230,"PGNName":"Door Status","StartByte":1,"StartBit":1,"Length":2,"Resolution":1,"Offset":0,"Unit":"bit","LowerDataRange":0,"UpperDataRange":1,"Status":{"Description":["Close","Open"],"Name":"Enable"}},{"SPNNo":9011,"SPNName":"Rear Door Status","PGNNo":64230,"PGNName":"Door Status","StartByte":1,"StartBit":3,"Length":2,"Resolution":1,"Offset":0,"Unit":"bit","LowerDataRange":0,"UpperDataRange":1,"Status":{"Description":["Close","Open"],"Name":"Enable"}}];
      return of(defs);
    }

    getVehicleCodes(fcode: string): Observable<string> {
      return this.getFleets().pipe(
          map((fleets: any[]) =>
              fleets.find(fleet => fleet.code.toUpperCase() === fcode.toUpperCase())
                .vehicles.map((vehicle: any) => vehicle.code)
          )
      );
    }

}
