import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { VehicleComponent } from './vehicle.component';
import { VehicleListComponent } from './vehicle-list.component';
import { NativeScriptUIGaugeModule } from 'nativescript-ui-gauge/angular';
import { VehicleStatesComponent } from './vehicle-states.component';

@NgModule({
  declarations: [VehicleComponent, VehicleListComponent, VehicleStatesComponent],
  imports: [
    HomeRoutingModule,
    NativeScriptUIGaugeModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
