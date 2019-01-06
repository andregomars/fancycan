import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { NgxGaugeModule } from 'ngx-gauge';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { SelectModule } from 'ng-select';

import { FleetDashboardComponent } from './fleet-dashboard.component';
import { FleetRoutingModule } from './fleet-routing.module';
import { AppPipeModule } from '../../pipes/pipes.module';
import { ComponentsModule } from './../../components/components.module';
import { FleetListComponent } from './fleet-list.component';
import { FleetContainerComponent } from './fleet-container.component';
import { CompareStatisticComponent } from './compare-statistic.component';
import { ChecklistLogComponent } from './checklist-log.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    BsDropdownModule,
    BsDatepickerModule,
    // NgxGaugeModule,
    FleetRoutingModule,
    SelectModule,
    AppPipeModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
    ComponentsModule,
  ],
  declarations: [
    FleetListComponent,
    FleetDashboardComponent,
    FleetContainerComponent,
    CompareStatisticComponent,
    ChecklistLogComponent,
  ],
})
export class FleetModule { }
