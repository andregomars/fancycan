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
        path: 'home',
        component: NSEmptyOutletComponent,
        outlet: 'homeTab',
        loadChildren: '~/app/views/home/home.module#HomeModule'
      },
      {
        path: 'scan',
        component: NSEmptyOutletComponent,
        outlet: 'scanTab',
        loadChildren: '~/app/views/scan/scan.module#ScanModule'
      },
      {
        path: 'setting',
        component: NSEmptyOutletComponent,
        outlet: 'settingTab',
        loadChildren: '~/app/views/setting/setting.module#SettingModule'
      },
      {
        path: 'alert',
        component: NSEmptyOutletComponent,
        outlet: 'alertTab',
        loadChildren: '~/app/views/alert/alert.module#AlertModule'
      },
      {
        path: 'more',
        component: NSEmptyOutletComponent,
        outlet: 'moreTab',
        loadChildren: '~/app/views/more/more.module#MoreModule'
      },
    ]
  }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class DefaultLayoutRoutingModule { }
