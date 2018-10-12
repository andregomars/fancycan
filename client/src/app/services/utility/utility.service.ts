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

    getSPNListWithStatusArray(spnList$: Observable<any[]>): Observable<any[]> {
        return spnList$.pipe(
            map(spnList => this.buildSPNStatusArray(spnList))
            // map(spnList => spnList.map(spn => Object.assign({}, spn, { selected: false }))),
            // map(spnList => spnList.map(spn => {
            //     if (spn.Status && spn.Status.Description
            //         && spn.Status.Description.length > 0) {
            //         spn['StatusList'] = this.evaluateSPNStatusValue(spn.Status.Description, spn.Status.Name);
            //     } else {
            //         spn['StatusList'] = [];
            //     }
            //     return spn;
            // }))
        );
    }

    // 1. add selection field in each entry
    // 2. translate status description to code based on index
    private buildSPNStatusArray(spnList: any[]): any[] {
        return spnList.map(spn => Object.assign({}, spn, { selected: false }))
            .map(spn => {
                if (spn.Status && spn.Status.Description
                    && spn.Status.Description.length > 0) {
                    spn['StatusList'] = this.evaluateSPNStatusValue(spn.Status.Description, spn.Status.Name);
                } else {
                    spn['StatusList'] = [];
                }
                return spn;
            });
    }

    getFlattedSPNSpecWithStatusArray(spnSpecs$: Observable<any[]>): Observable<any> {
        return spnSpecs$.pipe(
            map(spnSpecs => this.getFlattedSPNSpecs(spnSpecs)),
            map(flattedSpecs => this.buildSPNStatusArray(flattedSpecs))
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

    /*
        e.g.
        input: ['On', 'Off', 'Error'], 'Off'
        output: [
            { status: 'On', value: '00', enabled: false },
            { status: 'Off', value: '01', enabled: true },
            { status: 'Error', value: '10', enabled: false }
        ]
    */
    private evaluateSPNStatusValue(keys: string[], enabledKey: string): any[] {
        return keys.map((key, i) => {
            return {
                status: key,
                value: (i).toString(2),
                enabled: key === enabledKey
            };
        });

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
