import { Rxios } from 'rxios';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IJ1939, IUser } from 'fancycan-model';
import { TransformUtility } from 'fancycan-utility';
import { ConfigUtility } from '../utility';

export class FireLayer {
    private http: Rxios;

    constructor() {
        this.http = new Rxios({
            baseURL: ConfigUtility.getFbConnectionString(),
        });
    }

    public getDefinitions(): Observable<any> {
        return this.http.get<any>('/definitions.json');
    }

    public getProprietarySpnList(): Observable<any> {
        return this.http.get<any>('/proprietary-spn.json');
    }

    public getJ1939SpnList(): Observable<any> {
        return this.http.get<any>('/j1939spn.json');
    }

    public getFleets(): Observable<any> {
        return this.http.get<any>('/fleets.json');
    }

    public getUsers(): Observable<IUser[]> {
        return this.http.get<IUser[]>('/users.json');
    }

    public getDefinitionWithSpecs(definitions$: Observable<any>,
        propietarySpns$: Observable<any>, j1939Spns$: Observable<any>): Observable<IJ1939[]> {
        const transform = new TransformUtility();
        return forkJoin(definitions$, propietarySpns$, j1939Spns$).pipe(
            map(([defs, spnsProp, spns1939]) => transform.getDefinitionWithSpecs(defs, spnsProp, spns1939))
        );
    }

    public getMalfunctionSetting(): Observable<any> {
        return this.http
            .get<any>(`/malfunction-setting.json`);
    }

}
