import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { ViewProfile } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

    getFlattedVehicles(fleets$: Observable<any>): Observable<any> {
        return fleets$.pipe(
            map(fleets => fleets.reduce((all, fleet) => {
                const vlist = fleet.vehicles.map(v => {
                    return {
                        vcode: v.code,
                        fcode: fleet.code
                    };
                });
                return [...all, ...vlist];
            }, []))
        );
    }

    getViewProfileByVehicleCode(vcode: string, fleets$: Observable<any>): Observable<ViewProfile> {
        return this.getFlattedVehicles(fleets$).pipe(
            map((vehicles: any[]) => vehicles.find(vehicle => vehicle.vcode === vcode)),
            map(vehicle => {
                return {
                   fleet_code: vehicle.fcode,
                   vehicle_code: vehicle.vcode,
                };
            })
        );
    }

    getVehiclesByFleetCode(fcode: string, fleets$: Observable<any>): Observable<any[]> {
         return this.getFlattedVehicles(fleets$).pipe(
            map((vehicles: any[]) =>
                vehicles.filter(vehicle => vehicle.fcode.toUpperCase() === fcode.toUpperCase()))
        );
    }
}
