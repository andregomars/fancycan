import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { FleetDashboardComponent } from './fleet-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: FleetDashboardComponent,
    data: {
      title: 'Fleet Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule {}
