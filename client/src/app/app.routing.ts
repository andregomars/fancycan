import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './views/common/login.component';
import { ViewGuard } from './guards/view.guard';
import { AdminGuard } from './guards/admin.guard';

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
        canActivate: [AdminGuard, ViewGuard],
        loadChildren: './views/user/user.module#UserModule'
      },
      {
        path: 'fleet',
        canActivate: [ViewGuard],
        loadChildren: './views/fleet/fleet.module#FleetModule'
      },
      {
        path: 'vehicle',
        canActivate: [ViewGuard],
        loadChildren: './views/vehicle/vehicle.module#VehicleModule'
      },
      {
        path: 'statistic',
        canActivate: [ViewGuard],
        loadChildren: './views/statistic/statistic.module#StatisticModule'
      },
      {
        path: 'archive',
        canActivate: [ViewGuard],
        loadChildren: './views/archive/archive.module#ArchiveModule'
      },
      {
        path: 'setting',
        canActivate: [ViewGuard],
        loadChildren: './views/setting/setting.module#SettingModule'
      },
      {
        path: 'admin',
        canActivate: [AdminGuard, ViewGuard],
        loadChildren: './views/admin/admin.module#AdminModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
