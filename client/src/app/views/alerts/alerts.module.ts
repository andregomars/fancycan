import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './../../components/components.module';
import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent } from './alerts.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    AlertsRoutingModule
  ],
  declarations: [
    AlertsComponent
  ],
  providers: [
  ]
})
export class AlertsModule { }
