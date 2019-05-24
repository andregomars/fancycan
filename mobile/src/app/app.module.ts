import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
// import { TransformUtility } from "fancycan-utility";
import { BarcodeScanner } from 'nativescript-barcodescanner';
// import { BarcodeScannerService as BarcodeScanner } from "./services/barcode-scanner.service";

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
        // TransformUtility,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        BarcodeScanner,
        UtilityService,
        // TransformUtility,
        DataService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
