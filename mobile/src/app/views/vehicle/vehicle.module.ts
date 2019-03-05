import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { VehicleComponent } from './vehicle.component';
import { VehicleListComponent } from './vehicle-list.component';

@NgModule({
  declarations: [VehicleComponent, VehicleListComponent],
  imports: [
    VehicleRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class VehicleModule { }
