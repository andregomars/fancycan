import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { VehicleSettingComponent } from './vehicle-setting.component';
import { VehicleSettingListComponent } from './vehicle-setting-list.component';

const routes: Routes = [
    { path: '', component: VehicleSettingListComponent },
    { path: ':id', component: VehicleSettingComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class SettingRoutingModule { }
