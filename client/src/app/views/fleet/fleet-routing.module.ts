import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { FleetDashboardComponent } from './fleet-dashboard.component';
import { FleetListComponent } from './fleet-list.component';
import { FleetContainerComponent } from './fleet-container.component';
import { FleetGuard } from '../../guards/fleet.guard';

const routes: Routes = [
  {
    path: '',
    component: FleetContainerComponent,
    data: {
      title: 'Fleet'
    },
    children: [
      {
        path: 'list',
        component: FleetListComponent,
        data: {
          title: 'Fleet List'
        }
      },
      {
        path: 'list/:fcode',
        component: FleetListComponent,
        data: {
          title: 'Fleet List'
        }
      },
      {
        path: 'dashboard',
        component: FleetDashboardComponent,
        canActivate: [FleetGuard],
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'dashboard/:fcode',
        component: FleetDashboardComponent,
        data: {
          title: 'Dashboard'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule { }
