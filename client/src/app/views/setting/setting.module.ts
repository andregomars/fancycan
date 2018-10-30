import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

import { SettingContainerComponent } from './setting-container.component';
import { SpnSpecificationComponent } from './spn-specification.component';
import { SettingRoutingModule } from './setting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgStringPipesModule } from 'angular-pipes';
import { ComponentsModule } from '../../components/components.module';
import { SpnProprietaryComponent } from './spn-proprietary.component';
import { SpnDefinitionComponent } from './spn-definition.component';
import { MalfunctinoSettingComponent } from './malfunction-setting.component';
import { UsageSettingComponent } from './usage-setting.component';
import { VehicleTemplateComponent } from './vehicle-template.component';
import { FleetSettingComponent } from './fleet-setting.component';
import { ChecklistSettingComponent } from './checklist-setting.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgStringPipesModule,
    SettingRoutingModule,
    QRCodeModule,
    ComponentsModule
  ],
  declarations: [
    SettingContainerComponent,
    SpnSpecificationComponent,
    SpnProprietaryComponent,
    SpnDefinitionComponent,
    MalfunctinoSettingComponent,
    UsageSettingComponent,
    VehicleTemplateComponent,
    FleetSettingComponent,
    ChecklistSettingComponent
  ]
})
export class SettingModule { }
