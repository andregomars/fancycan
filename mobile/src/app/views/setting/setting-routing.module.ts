import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { VehicleSettingComponent } from './vehicle-setting.component';

const routes: Routes = [
    { path: "", component: VehicleSettingComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SettingRoutingModule { }
