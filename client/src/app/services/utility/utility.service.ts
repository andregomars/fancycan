import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Buffer } from 'buffer/';

import { ViewProfileStateModel } from '../../models';

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

    getViewProfileByFleetCode(fcode: string, fleets$: Observable<any>): Observable<any[]> {
        return this.getFlattedVehicles(fleets$).pipe(
            map((vehicles: any[]) =>
                vehicles.filter(vehicle => vehicle.fcode.toUpperCase() === fcode.toUpperCase()))
        );
    }

    getVehiclesByFleetCode(fcode: string, fleets$: Observable<any>) {
        return fleets$.pipe(
            map((fleets: any[]) =>
                fleets.find(fleet => fleet.code.toUpperCase() === fcode.toUpperCase())
                    .vehicles.map(vehicle => {
                        return {...vehicle, fcode: fcode};
                    })
            )
        );
    }

    getSPNListWithStatusArray(spnList$: Observable<any[]>): Observable<any[]> {
        return spnList$.pipe(
            map(spnList => this.buildSPNStatusArray(spnList))
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

    attachMapLabels(vehicles: any): any {
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

    attachGeoLabels(vehicle: any): any {
        const locs: any[] = [...vehicle.geo];
        vehicle.geo = locs.map(loc => {
            return Object.assign(loc, {
                label: {
                    color: '#ffffff',
                    fontFamily: '',
                    fontSize: '9px',
                    fontWeight: 'normal',
                    text: vehicle.code
                }
            });
        });
        return vehicle;
    }

    convertSelectOptions(options: string[], values: string[]): any[] {
        return options.map(opt => {
            return {
                name: opt,
                selected: values.includes(opt)
            };
        });
    }

    // decodeJ1939(raw: Buffer, startBit: number, length: number): number {
    //     const definition = {
    //         StartByte: Math.ceil(startBit / 8),
    //         StartBit: startBit % 8 === 0 ? 8 : startBit % 8,
    //         Length: length
    //     };

    //     /*** same as server transform ***/
    //     const bytesCount = Math.ceil((definition.Length + definition.StartBit - 1) / 8);
    //     const bytes = raw.slice(definition.StartByte - 1, definition.StartByte - 1 + bytesCount);

    //     const parsedValues: number[] = [];
    //     const firstIdx = bytes.length - 1;
    //     const lastIdx = 0;
    //     for (let i = 0; i < bytes.length; i++) {
    //       let value = 0;
    //       if (i === firstIdx) { // the first byte
    //         const firstByte = bytes[firstIdx];
    //         // tslint:disable-next-line:no-bitwise
    //         value = firstByte >> (definition.StartBit - 1) & (Math.pow(2, definition.Length) - 1);
    //       } else if (i === lastIdx) { // the last byte
    //         const lastByte = bytes[lastIdx];
    //         const shift = (definition.StartBit + definition.Length - 1) % 8;
    //         // tslint:disable-next-line:no-bitwise
    //         value = lastByte & (Math.pow(2, (shift === 0 ? 8 : shift)) - 1);
    //       } else {
    //         value = bytes[i];
    //       }
    //       parsedValues.push(value);
    //     }

    //     return Buffer.from(parsedValues).readUIntLE(0, bytesCount);
    // }

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

}
