import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { MoreRoutingModule } from './more-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { VehicleSettingComponent } from './vehicle-setting.component';

@NgModule({
  declarations: [VehicleSettingComponent],
  imports: [
    MoreRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MoreModule { }
