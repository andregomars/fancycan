import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'fleet',
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
        path: 'vehicle/:id',
        loadChildren: './views/vehicle/vehicle.module#VehicleModule'
      },
      {
        path: 'alerts/:id',
        loadChildren: './views/alerts/alerts.module#AlertsModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
