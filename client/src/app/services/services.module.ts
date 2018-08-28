import { NgModule } from '@angular/core';
import { DataService } from './data';

@NgModule({
    declarations: [
        DataService,
    ],
    exports: [
        DataService,
    ]
})
export class AppServiceModule { }
