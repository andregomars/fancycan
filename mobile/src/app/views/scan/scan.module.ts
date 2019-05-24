import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";
import { NativeScriptUIAutoCompleteTextViewModule } from "nativescript-ui-autocomplete/angular";


import { ScanRoutingModule } from './scan-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { CheckListComponent } from './check-list.component';



@NgModule({
  declarations: [CheckListComponent],
  imports: [
    ScanRoutingModule,
    NativeScriptUIDataFormModule,
    NativeScriptUIAutoCompleteTextViewModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ScanModule { }
