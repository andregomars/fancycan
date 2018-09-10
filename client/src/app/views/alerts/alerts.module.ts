import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './../../components/components.module';
import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent } from './alerts.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ChartsModule,
    AlertsRoutingModule
  ],
  declarations: [
    AlertsComponent
  ],
  providers: [
  ]
})
export class AlertsModule { }
