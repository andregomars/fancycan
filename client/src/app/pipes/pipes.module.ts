import { NgModule } from '@angular/core';
import { ToNumberPipe } from './to-number';

@NgModule({
    declarations: [
        ToNumberPipe,
    ],
    exports: [
        ToNumberPipe,
    ]
})
export class AppPipeModule { }
