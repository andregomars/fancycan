import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { ComponentsModule } from './../../components/components.module';
import { StatisticComponent } from './statistic.component';
import { FleetMalfunctionComponent } from './fleet-malfunction.component';
import { StatisticRoutingModule } from './statistic-routing.module';
import { FleetStatisticComponent } from './fleet-statistic.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ChartsModule,
    StatisticRoutingModule
  ],
  declarations: [
    StatisticComponent,
    FleetStatisticComponent,
    FleetMalfunctionComponent
  ]
})
export class StatisticModule { }
