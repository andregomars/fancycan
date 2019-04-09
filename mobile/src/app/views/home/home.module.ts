import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { VehicleComponent } from './vehicle.component';
import { VehicleListComponent } from './vehicle-list.component';
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';

@NgModule({
  declarations: [VehicleComponent, VehicleListComponent],
  imports: [
    HomeRoutingModule,
    NativeScriptUIGaugeModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
