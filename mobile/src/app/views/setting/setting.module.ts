import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { SettingRoutingModule } from './setting-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { VehicleSettingComponent } from './vehicle-setting.component';
import { VehicleSettingListComponent } from './vehicle-setting-list.component';

@NgModule({
  declarations: [
    VehicleSettingListComponent,
    VehicleSettingComponent
  ],
  imports: [
    SettingRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SettingModule { }
