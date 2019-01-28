import _ from 'lodash';
import { Buffer } from 'buffer/';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ICan, ICanState, IJ1939, Dm1EntryType, Dm1Collection, Dm1Data, ViewProfileStateModel, IVehicleState, Geolocation } from 'fancycan-model';

import { SpnRepository, ViewProfileRepository } from '../repository';

export class Transform {
    private spnRepo: SpnRepository;
    private viewProfileRepo: ViewProfileRepository;

    constructor() {
        this.spnRepo = new SpnRepository();
        this.viewProfileRepo = new ViewProfileRepository();
    }

    public buildCanStates(cans: ICan[]): ICanState[] {
        return cans.map((can: ICan) => this.buildCanState(can)).reduce((pre, cur) => [...pre, ...cur]);
    }

    public buildCanState(can: ICan): ICanState[] {
        const pgnID = this.decodePGN(can.canID);
        const spns = this.spnRepo.retrieveSpnsByPgnFromCache(pgnID);

        if (!spns) {
            return [];
        }

        const canStates = new Array<ICanState>();
        for (const spn of spns!) {
            const val = this.decodeData(can.canData, spn);
            // const vcode = _.random(6001, 6010).toString();
            const state: ICanState = {
                canObjID: can._id,
                // canObjID: can.rawID,
                vcode: can.remotePort.toString(),
                spnNo: spn.SPNNo,
                spnName: spn.SPNName,
                pgnNo: pgnID,
                pgnName: spn.PGNName,
                value: val,
                unit: spn.Unit,
                min: spn.LowerDataRange,
                max: spn.UpperDataRange,
            };
            canStates.push(state);
        }

        return canStates;
    }

    public decodePGN(canID: Buffer): number {
        return canID.readUInt16BE(1);
    }

    public decodeJ1939(rawHex: string, startBit: number, length: number) {
        const definition: IJ1939 = {
            StartByte: Math.ceil(startBit / 8),
            StartBit: startBit % 8 === 0 ? 8 : startBit % 8,
            Length: length,
            Code: '',
            SPNNo: 0,
            SPNName: '',
            PGNNo: 0,
            PGNName: '',
            Resolution: 1,
            Offset: 0,
            Unit: '',
            LowerDataRange: 0,
            UpperDataRange: 0,
            Status: {
                Name: '',
                Description: []
            }
        };

        return this.decodeData(Buffer.from(rawHex, 'hex'), definition);
    }

    public decodeData(raw: Buffer, definition: IJ1939): number {
        const bytesCount = Math.ceil((definition.Length + definition.StartBit - 1) / 8);
        const bytes = raw.slice(definition.StartByte - 1, definition.StartByte - 1 + bytesCount);

        const parsedValues: number[] = [];
        const firstIdx = bytes.length - 1;
        const lastIdx = 0;
        for (let i = 0; i < bytes.length; i++) {
            let value = 0;
            if (i === firstIdx) { // the first byte
                const firstByte = bytes[firstIdx];
                // tslint:disable-next-line:no-bitwise
                value = firstByte >> (definition.StartBit - 1) & (Math.pow(2, definition.Length) - 1);
            } else if (i === lastIdx) { // the last byte
                const lastByte = bytes[lastIdx];
                const shift = (definition.StartBit + definition.Length - 1) % 8;
                // tslint:disable-next-line:no-bitwise
                value = lastByte & (Math.pow(2, (shift === 0 ? 8 : shift)) - 1);
            } else {
                value = bytes[i];
            }
            parsedValues.push(value);
        }

        const val = Buffer.from(parsedValues).readUIntLE(0, bytesCount);
        return _.round(val * definition.Resolution + definition.Offset, 4);
    }

    public buildVehicleState(canState: ICanState): IVehicleState | undefined {
        const geolocations: Geolocation[] = [
            { latitude: 34.057539, longitude: -118.237494 },
            { latitude: 34.056544, longitude: -118.238082 },
            { latitude: 34.055955, longitude: -118.238996 },
            { latitude: 34.056325, longitude: -118.239507 },
        ];
        const viewProfile = this.viewProfileRepo.retrieveViewProfileByVehicleCodeFromCache(canState.vcode);
        if (!viewProfile) {
            return undefined;
        }

        const state: IVehicleState = {
            vcode: canState.vcode,
            vin: viewProfile.vin,
            fcode: viewProfile.fcode,
            fname: viewProfile.fname,
            geolocations: geolocations,
        };
        state['spn' + canState.spnNo] = canState.value;
        return state;
    }

    public buildVehicleMalfuncState(canState: ICanState): any {
        const fcode = 'BYD';
        const state: any = {
            vcode: canState.vcode,
            fcode: fcode,
            spn: canState.spnNo,
            value: canState.value,
            type: 'General',
            CreatedDate: canState.canObjID.getTimestamp(),
        };
        return state;
    }

    public decodeDm1(canData: string, entryType: Dm1EntryType, dm1Collection: Dm1Collection): Dm1Collection {
        const buffer = Buffer.from(canData, 'hex');
        if (entryType === Dm1EntryType.Single) {
            return this.decodeDm1Single(buffer);
        } else {
            return this.decodeDm1Mutiple(buffer, dm1Collection, entryType);
        }
    }

    public getViewProfileByVehicleCode(vcode: string, fleets$: Observable<any>): Observable<ViewProfileStateModel> {
        return this.getFlattedVehicles(fleets$).pipe(
            map((vehicles: any[]) => vehicles.find((vehicle: any) => vehicle.vcode === vcode)),
            map((vehicle: any) => {
                return {
                    fcode: vehicle.fcode,
                    fname: vehicle.fname,
                    vcode: vehicle.vcode,
                    vin: vehicle.vin
                };
            })
        );
    }

    public getViewProfileByFleetCode(fcode: string, fleets$: Observable<any>): Observable<any[]> {
        return this.getFlattedVehicles(fleets$).pipe(
            map((vehicles: any[]) =>
                vehicles.filter((vehicle: any) => vehicle.fcode.toUpperCase() === fcode.toUpperCase()))
        );
    }

    public getFlattedVehicles(fleets$: Observable<any>): Observable<any> {
        return fleets$.pipe(
            map((fleets: any[]) => fleets.reduce((all, fleet) => {
                const vlist = fleet.vehicles.map((v: any) => {
                    return {
                        vcode: v.code,
                        vin: v.vin,
                        fcode: fleet.code,
                        fname: fleet.name
                    };
                });
                return [...all, ...vlist];
            }, []))
        );
    }

    /// private helpers section

    private decodeDm1Single(buffer: Buffer): Dm1Collection {
        const data = this.buildDm1DataFromBuffer(buffer.slice(2, 6));

        const collection: Dm1Collection = {
            lamp: buffer[0],
            packetsCount: 1,
            entriesCount: 1,
            entriesBuffer: buffer,
            data: [data]
        };

        return collection;
    }

    private buildDm1DataFromBuffer(buffer: Buffer): Dm1Data {
        return {
            spn: buffer.readUInt16LE(0),
            fmi: buffer[2],
            count: buffer[3]
        } as Dm1Data;
    }

    private decodeDm1Mutiple(buffer: Buffer, dm1Collection: Dm1Collection, entryType: Dm1EntryType): Dm1Collection {
        // header
        if (entryType === Dm1EntryType.MultiHeader) {
            dm1Collection.packetsCount = (buffer[1] - 2) / 4;
            dm1Collection.entriesCount = Math.ceil(buffer[1] / 7);
        } else {
            // data
            const concatedLength = dm1Collection.entriesBuffer.length + 7;
            dm1Collection.entriesBuffer = Buffer.concat([dm1Collection.entriesBuffer, buffer.slice(1, 8)], concatedLength);
            const collectionID = buffer[0];

            // after the last data entry, wrap up the whole collection
            if (collectionID === dm1Collection.entriesCount) {
                dm1Collection = this.wrapUpDm1DataCollection(dm1Collection);
            }
        }
        return dm1Collection;
    }

    private wrapUpDm1DataCollection(dm1Collection: Dm1Collection): Dm1Collection {
        dm1Collection.lamp = dm1Collection.entriesBuffer[0];
        const bytesCount = dm1Collection.packetsCount * 4 + 2;
        const dataBuffer = dm1Collection.entriesBuffer.slice(2, bytesCount);
        const buffers = _.chunk<number>(dataBuffer, 4);
        dm1Collection.data = buffers.map((val: number[]) => this.buildDm1DataFromBuffer(Buffer.from(val)));
        return dm1Collection;
    }
}
