import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { FleetDashboardComponent } from './fleet-dashboard.component';
import { FleetListComponent } from './fleet-list.component';
import { CompareStatisticComponent } from './compare-statistic.component';
import { FleetContainerComponent } from './fleet-container.component';
import { ChecklistLogComponent } from './checklist-log.component';
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
      },
      {
        path: 'compare',
        component: CompareStatisticComponent,
        canActivate: [FleetGuard],
        data: {
          title: 'Compare'
        }
      },
      {
        path: 'compare/:fcode',
        component: CompareStatisticComponent,
        data: {
          title: 'Compare'
        }
      },
      {
        path: 'checklist',
        component: ChecklistLogComponent,
        canActivate: [FleetGuard],
        data: {
          title: 'Checklist'
        }
      },
      {
        path: 'checklist/:fcode',
        component: ChecklistLogComponent,
        data: {
          title: 'Checklist'
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
