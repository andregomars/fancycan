import { Rxios } from 'rxios';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IJ1939 } from 'fancycan-model';
import { ConfigUtility } from '../utility';

export class FireLayer {
    private http: Rxios;

    constructor() {
        const config = new ConfigUtility();
        this.http = new Rxios({
            baseURL: config.getFbConnectionString(),
        });
    }

    public getDefinitions(): Observable<any> {
        return this.http
            .get<any>(`/definitions.json`);
    }

    public getProprietarySpnList(): Observable<any> {
        return this.http
            .get<any>(`/proprietary-spn.json`);
    }

    public getJ1939SpnList(): Observable<any> {
        return this.http
            .get<any>(`/j1939spn.json`);
    }

    public getFleets(): Observable<any> {
        return this.http
            .get<any>(`/fleets.json`);
    }

    public getDefinitionWithSpecs(): Observable<IJ1939[]> {
        return forkJoin(this.getDefinitions(), this.getProprietarySpnList(), this.getJ1939SpnList()).pipe(
            map(([defs, spnsProp, spns1939]) => {
                spns1939 = this.getFlattedSPNSpecs(spns1939);
                const spnGroups = defs.map((def: any) => {
                    const spnsPropMatched = spnsProp.filter((spn: any) =>
                        def.type === 'Proprietary' && def.spn === spn.SPNNo && def.pgn === spn.PGNNo);
                    const spns1939Matched = spns1939.filter((spn: any) =>
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
            }),
        );
    }

    public getMalfunctionSetting(): Observable<any> {
        return this.http
            .get<any>(`/malfunction-setting.json`);
    }

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
}