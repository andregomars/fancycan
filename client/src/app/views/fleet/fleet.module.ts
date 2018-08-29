import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { NgxGaugeModule } from 'ngx-gauge';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { FleetComponent } from './fleet.component';
import { VehicleComponent } from './vehicle.component';
import { FleetRoutingModule } from './fleet-routing.module';
import { environment } from '../../../environments/environment';
import { AppPipeModule } from '../../pipes/pipes.module';
import { DataService } from '../../services';
import { FleetOutletComponent } from './fleet-outlet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    NgxGaugeModule,
    FleetRoutingModule,
    AppPipeModule,
    AgmCoreModule.forRoot(environment.agm),
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    ButtonsModule.forRoot()
  ],
  declarations: [
    FleetOutletComponent,
    FleetComponent,
    VehicleComponent
  ],
  providers: [
    DataService
  ]
})
export class FleetModule { }
