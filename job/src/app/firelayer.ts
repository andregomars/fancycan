import { Rxios } from 'rxios';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IJ1939 } from 'fancycan-model';

export class FireLayer {
    private http: Rxios;

    constructor(fireUrl: string) {
        this.http = new Rxios({
            baseURL: fireUrl,
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

    public getMalfunctionSetting(): Observable<any> {
        return this.http
            .get<any>(`/malfunction-setting.json`);
    }

}
