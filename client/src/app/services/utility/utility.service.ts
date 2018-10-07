import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { ViewProfileStateModel } from '../../models';
import * as moment from 'moment';

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

    getViewProfileByVehicleCode(vcode: string, fleets$: Observable<any>): Observable<ViewProfileStateModel> {
        return this.getFlattedVehicles(fleets$).pipe(
            map((vehicles: any[]) => vehicles.find(vehicle => vehicle.vcode === vcode)),
            map(vehicle => {
                return {
                    fcode: vehicle.fcode,
                    vcode: vehicle.vcode,
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
        ).reduce((acc, cur) => [...acc, ...cur], []);
    }

    getCurrentData(): Observable<any> {
        return of(this.randomObject());
    }

    formatDataTime(data: any) {
        return {
            time: moment(data.time).format('hh:mm:ss'),
            num: data.num
        };
    }

    formatRawCAN(can: string) {
        return can.split('').reduce((output, char, i) =>
            output + char + ((i % 2 !== 0) ? ' ' : '')
        , '').trim();

    }

    getAggregateData(sourcList: any[], keyName: string, valueName: string): any[] {
        let output = [];
        sourcList.forEach(current => {
        const scannedObj = output.find(sourceObj => sourceObj[keyName] === current[keyName]);

        if (scannedObj) {
            if (valueName) {
            scannedObj[valueName] += current[valueName];
            } else {
            scannedObj[valueName] += 1;
            }
        } else {
            output = [...output, current];
        }
        });

        return output;
    }

    private randomObject(): any {
        const time = new Date();
        const num = this.randomNumberRange(20, 80);
        return {
            time: time,
            num: num
        };
    }

    private randomNumberRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    attachMapLabel(vehicles: any): any {
        return vehicles.map(vehicle => {
            return Object.assign(vehicle, {
                label: {
                    color: '#ffffff',
                    fontFamily: '',
                    fontSize: '9px',
                    fontWeight: 'normal',
                    text: vehicle.code.toString()
                }
            });
        });
    }
}
