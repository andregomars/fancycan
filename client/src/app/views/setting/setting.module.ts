import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingContainerComponent } from './setting-container.component';
import { SpnSpecificationComponent } from './spn-specification.component';
import { SettingRoutingModule } from './setting-routing.module';
import { FormsModule } from '@angular/forms';
import { NgStringPipesModule } from 'angular-pipes';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgStringPipesModule,
    SettingRoutingModule,
    ComponentsModule
  ],
  declarations: [
    SettingContainerComponent,
    SpnSpecificationComponent
  ]
})
export class SettingModule { }
