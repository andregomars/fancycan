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

    getFlattedSPNSpecs(specs: any[]): any[] {
        console.log(specs[0].SPNItems)
        return specs.map(pgn =>
            pgn.SPNItems.map(spn =>
                Object.assign({},
                    spn,
                    { TransmissionRate: pgn.TransmissionRate },
                    { PGNNo: pgn.PGNNo },
                    { SA: pgn.SA },
                    { DA: pgn.DA },
                    { Priority: pgn.Priority }
                )
            )
        );
    }

    attachMapLabel(vehicles: any): any {
        return vehicles.map(ve => {
            return Object.assign(ve, {
                label: {
                    color: '#ffffff',
                    fontFamily: '',
                    fontSize: '9px',
                    fontWeight: 'normal',
                    text: ve.bus_number.toString()
                }
            });
        });
    }
}
