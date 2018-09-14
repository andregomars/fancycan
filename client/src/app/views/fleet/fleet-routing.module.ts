import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { FleetDashboardComponent } from './fleet-dashboard.component';
import { FleetListComponent } from './fleet-list.component';

const routes: Routes = [
  {
    path: '',
    component: FleetListComponent,
    data: {
      title: 'Fleet'
    }
  },
  {
    path: ':id',
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
