import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { format } from 'date-fns';
import { Buffer } from 'buffer/';
import { ObjectID } from 'bson';
import { ICan, ICanEntry } from 'fancycan-model';
import { TransformService } from './transform.service';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor(
        private transform: TransformService
    ) {}

    getVehiclesByFleetCode(fcode: string, fleets$: Observable<any>) {
        return fleets$.pipe(
            map((fleets: any[]) =>
                fleets.find(fleet => fleet.code.toUpperCase() === fcode.toUpperCase())
                    .vehicles.map(vehicle => {
                        return { ...vehicle, fcode: fcode };
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
            time: format(data.time, 'HH:mm:ss'),
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

    attachGeoLocationAndMapLabel(vehicles: any): any {
        return vehicles.map(vehicle => {
            let lat: number;
            let long: number;
            if (vehicle.geolocations && vehicle.geolocations.length > 0) {
                lat = vehicle.geolocations[0].latitude;
                long = vehicle.geolocations[0].longitude;
                return Object.assign(vehicle, {
                    label: {
                        color: '#ffffff',
                        fontFamily: '',
                        fontSize: '9px',
                        fontWeight: 'normal',
                        text: vehicle.vcode.toString()
                    },
                    latitude: lat,
                    longitude: long
                });
            } else {
                return vehicle;
            }
        });
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

    buildVehicleStateSpnList(vehicleState: any, spnProfileList: any[]): any[] {
        const spns = [];
        for (const key in vehicleState) {
            if (key.startsWith('spn')) {
                const spn = key.substring(3).trimRight();
                const spnProfile = spnProfileList.find(profile => profile.SPNNo === +spn);
                if (spnProfile) {
                    spns.push({
                        spn: spn,
                        name: spnProfile.SPNName,
                        value: vehicleState[key],
                        unit: spnProfile.Unit
                    });
                }
            }
        }

        return spns;
    }

    buildVehicleState(vehicleState: any, cans: ICanEntry[], spnProfiles: any[]): any {
        for (const can of cans) {
            if (can.key) {
                const pgn = this.transform.decodePGN(Buffer.from(can.key, 'hex'));
                if (pgn) {
                    // get pgn related spn definitions
                    const spnDefs = spnProfiles.filter(p => p.PGNNo === pgn);
                    for (const spnDef of spnDefs) {
                        const val = this.transform.decodeData(Buffer.from(can.value, 'hex'), spnDef);
                        vehicleState['spn' + spnDef.SPNNo] = val;
                    }
                }
            }
        }

        return vehicleState;
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

    public buildCanEntry(can: ICan): ICanEntry {
        return {
            key: Buffer.from(can.canID).toString('hex'),
            value: Buffer.from(can.canData).toString('hex'),
            time: new ObjectID(can.rawID).getTimestamp()
        } as ICanEntry;
    }

    public buildCanEntryFromCanBson(canBson: any): ICanEntry {
        return {
            key: Buffer.from(canBson.canID.$binary, 'base64').toString('hex'),
            value: Buffer.from(canBson.canData.$binary, 'base64').toString('hex'),
            time: new ObjectID(canBson.rawID.$oid).getTimestamp()
        } as ICanEntry;
    }

    public buildCanEntries(cans: any[], isBson: boolean): ICanEntry[] {
        if (isBson) {
            return cans.map(can => this.buildCanEntryFromCanBson(can));
        } else {
            return cans.map(can => this.buildCanEntry(can as ICan));
        }
    }

    // output e.g. https://app.fancycan.com/fleet/checklist/BYD?item=tire&loc=fl
    public buildQrCode(fcode: string, item: string, location: string): string {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const url = `${protocol}//${host}/fleet/checklist`;
        return encodeURI(`${url}/${fcode}?item=${item}&loc=${location}`);
    }

}
