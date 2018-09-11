import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { FleetDashboardComponent } from './fleet-dashboard.component';
import { FleetComponent } from './fleet.component';

const routes: Routes = [
  {
    path: '',
    component: FleetComponent,
    data: {
      title: 'Fleet'
    }
  },
  {
    path: 'dashboard',
    component: FleetDashboardComponent,
    data: {
      title: 'Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule { }
