import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './views/common/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    },
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: ''
    },
    children: [
      {
        path: 'user',
        loadChildren: './views/user/user.module#UserModule'
      },
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
