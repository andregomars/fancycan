import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
// import { BarcodeScanner } from 'nativescript-barcodescanner';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UtilityService } from "./services/utility.service";
import { DataService } from "./services/data.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        HttpClientModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        // BarcodeScanner,
        UtilityService,
        DataService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
