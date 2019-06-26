import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular";

import { SettingRoutingModule } from './setting-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { VehicleSettingComponent } from './vehicle-setting.component';

@NgModule({
  declarations: [
    VehicleSettingComponent
  ],
  imports: [
    SettingRoutingModule,
    NativeScriptUIDataFormModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SettingModule { }
