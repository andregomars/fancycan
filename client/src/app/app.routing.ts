import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'fleet/list',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: ''
    },
    children: [
      {
        path: 'fleet',
        loadChildren: './views/fleet/fleet.module#FleetModule'
      },
      {
        path: 'vehicle',
        loadChildren: './views/vehicle/vehicle.module#VehicleModule'
      },
      {
        path: 'statistic',
        loadChildren: './views/statistic/statistic.module#StatisticModule'
      },
      {
        path: 'archive',
        loadChildren: './views/archive/archive.module#ArchiveModule'
      },
      {
        path: 'setting',
        loadChildren: './views/setting/setting.module#SettingModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
