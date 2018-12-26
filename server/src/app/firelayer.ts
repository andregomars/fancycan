import assert from 'assert';
import { Rxios } from 'rxios';
import { Observable } from 'rxjs';
import { Utility } from './services/utility';

export class FireLayer {
    private http: Rxios;

    constructor() {
        const rootUrl = new Utility().getFbConnectionString();
        this.http = new Rxios({
            baseURL: rootUrl,
        });
    }

    public getDefinitions(): Observable<any> {
        return this.http
            .get<any>(`/definitions.json`);
    }
}
