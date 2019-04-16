import _ from 'lodash';
import { Buffer } from 'buffer/';

import { IJ1939, Dm1EntryType, Dm1Collection, Dm1Data, ViewProfileStateModel } from 'fancycan-model';

export class TransformUtility {

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
        // return _.round(val * definition.Resolution + definition.Offset, 4);
        return val * definition.Resolution + definition.Offset;
    }

    public decodeDm1(canData: string, entryType: Dm1EntryType, dm1Collection: Dm1Collection): Dm1Collection {
        const buffer = Buffer.from(canData, 'hex');
        if (entryType === Dm1EntryType.Single) {
            return this.decodeDm1Single(buffer);
        } else {
            return this.decodeDm1Mutiple(buffer, dm1Collection, entryType);
        }
    }

    public getViewProfileByVehicleCode(vcode: string, fleets: any[]): ViewProfileStateModel {
        const vehicle = this.getFlattedVehicles(fleets).find((v: any) => v.vcode === vcode);
        return {
            fcode: vehicle.fcode,
            fname: vehicle.fname,
            vcode: vehicle.vcode,
            vin: vehicle.vin
        };
    }

    // public getViewProfileByFleetCode(fcode: string, fleets: any[]): any[] {
    //     return this.getFlattedVehicles(fleets).
    //         map((vehicles: any[]) =>
    //             vehicles.filter((vehicle: any) =>
    //                 vehicle.fcode.toUpperCase() === fcode.toUpperCase()));
    // }

    public getViewProfileByFleetCode(fcode: string, fleets: any[]): any[] {
        return this.getFlattedVehicles(fleets).filter((vehicle: any) =>
            vehicle.fcode.toUpperCase() === fcode.toUpperCase());
    }

    public getFlattedVehicles(fleets: any[]): any[] {
        return fleets.reduce((all, fleet) => {
            const vlist = fleet.vehicles.map((v: any) => {
                return {
                    vcode: v.code,
                    vin: v.vin,
                    fcode: fleet.code,
                    fname: fleet.name
                };
            });
            return [...all, ...vlist];
        }, []);
    }

    public getDefinitionWithSpecs(defs: any[], spnsProp: any[], spnsJ1939: any[]): IJ1939[] {
        spnsJ1939 = this.getFlattedSPNSpecs(spnsJ1939);
        const spnGroups = defs.map((def: any) => {
            const spnsPropMatched = spnsProp.filter((spn: any) =>
                def.type === 'Proprietary' && def.spn === spn.SPNNo && def.pgn === spn.PGNNo);
            const spns1939Matched = spnsJ1939.filter((spn: any) =>
                def.type === 'J1939' && def.spn === spn.SPNNo && def.pgn === spn.PGNNo);
            const spns = [...spnsPropMatched, ...spns1939Matched];
            return spns.map((spn: any) => {
                return {
                    Code: def.code,
                    SPNNo: +spn.SPNNo,
                    SPNName: spn.SPNName,
                    PGNNo: +spn.PGNNo,
                    PGNName: spn.PGNName,
                    StartByte: +spn.StartByte,
                    StartBit: +spn.StartBit,
                    Length: +spn.Length,
                    Resolution: +spn.Resolution,
                    Offset: +spn.Offset,
                    Unit: spn.Unit,
                    LowerDataRange: +spn.LowerDataRange,
                    UpperDataRange: +spn.UpperDataRange,
                    Status: spn.Status,
                } as IJ1939;
            });
        }).filter((x: any) => x.length > 0);  // remove def entry that cannot be found either in Proprietary or J1939 specs

        // deconstruct nested arrays
        return spnGroups.reduce((pre: IJ1939[], cur: IJ1939[]) => [...pre, ...cur]);
    }

    // }),
    //     );
    // }

    /// --- private helpers section ---

    private getFlattedSPNSpecs(specs: any[]): any[] {
        return specs.map((pgn: any) =>
            pgn.SPNItems.map((spn: any) =>
                Object.assign({},
                    spn,
                    { TransmissionRate: pgn.TransmissionRate },
                    { PGNNo: pgn.PGNNo },
                    { PGNName: pgn.PGNName },
                    { SA: pgn.SA },
                    { DA: pgn.DA },
                    { Priority: pgn.Priority },
                ),
            ),
        ).reduce((acc, cur) => [...acc, ...cur], []);
    }

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
