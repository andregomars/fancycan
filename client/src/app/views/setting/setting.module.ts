import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingContainerComponent } from './setting-container.component';
import { SpnSpecificationComponent } from './spn-specification.component';
import { SettingRoutingModule } from './setting-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgStringPipesModule } from 'angular-pipes';
import { ComponentsModule } from '../../components/components.module';
import { SpnProprietaryComponent } from './spn-proprietary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgStringPipesModule,
    SettingRoutingModule,
    ComponentsModule
  ],
  declarations: [
    SettingContainerComponent,
    SpnSpecificationComponent,
    SpnProprietaryComponent
  ]
})
export class SettingModule { }
