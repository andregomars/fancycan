import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';


import { environment, DataSourceType } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private sourceType: DataSourceType;
  private rootUrl: string;
  private delayEmulatorTimer: number;


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

}
