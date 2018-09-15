import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { FleetDashboardComponent } from './fleet-dashboard.component';
import { FleetListComponent } from './fleet-list.component';
import { FleetContainerComponent } from './fleet-container.component';

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
        path: 'list/:id',
        component: FleetListComponent,
        data: {
          title: 'Fleet List'
        }
      },
      {
        path: ':id',
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
