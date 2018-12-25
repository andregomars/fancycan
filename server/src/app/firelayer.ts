import assert from 'assert';
import { RxHR as http } from '@akanass/rx-http-request';
import { Observable } from 'rxjs';
import { Utility } from './services/utility';

export class FireLayer {
    private rootUrl: string;

    constructor() {
        this.rootUrl = new Utility().getFbConnectionString();
    }

    public getDefinitions(): Observable<any> {
        return http
            .get<any>(`${this.rootUrl}/definitions.json`);
    }
}
