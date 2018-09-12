import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxGaugeModule } from 'ngx-gauge';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { VehicleComponent } from './vehicle.component';
import { VehicleListComponent } from './vehicle-list.component';
import { VehicleRoutingModule } from './vehicle-routing.module';
import { AppPipeModule } from '../../pipes/pipes.module';
import { ComponentsModule } from './../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    NgxGaugeModule,
    AppPipeModule,
    VehicleRoutingModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    ComponentsModule,
  ],
  declarations: [
    VehicleComponent,
    VehicleListComponent
  ],
})
export class VehicleModule { }
