import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule, NSEmptyOutletComponent } from 'nativescript-angular/router';
import { DefaultLayoutComponent } from './default-layout.component';

const routes: Routes = [
  {
    path: "default",
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'vehicle',
        component: NSEmptyOutletComponent,
        outlet: 'vehicleTab',
        loadChildren: '~/app/views/vehicle/vehicle.module#VehicleModule'
      },
      {
        path: 'setting',
        component: NSEmptyOutletComponent,
        outlet: 'settingTab',
        loadChildren: '~/app/views/vehicle-setting/vehicle-setting.module#VehicleSettingModule'
      },
      {
        path: 'checklist',
        component: NSEmptyOutletComponent,
        outlet: 'checklistTab',
        loadChildren: '~/app/views/check-list/check-list.module#CheckListModule'
      },
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class DefaultLayoutRoutingModule { }
