import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { StatisticComponent } from './statistic.component';
import { FleetStatisticComponent } from './fleet-statistic.component';
import { FleetMalfunctionComponent } from './fleet-malfunction.component';
import { FleetGuard } from '../../guards/fleet.guard';

const routes: Routes = [
  {
    path: '',
    component: StatisticComponent,
    data: {
      title: 'Statistic'
    },
    children: [
      {
        path: 'fleet',
        component: FleetStatisticComponent,
        canActivate: [ FleetGuard ],
        data: {
          title: 'Fleet Stats'
        }
      },
      {
        path: 'fleet/:fcode',
        component: FleetStatisticComponent,
        data: {
          title: 'Fleet Stats'
        }
      },
      {
        path: 'malfunction/fleet',
        component: FleetMalfunctionComponent,
        canActivate: [ FleetGuard ],
        data: {
          title: 'Malfunction Stats'
        }
      },
      {
        path: 'malfunction/fleet/:fcode',
        component: FleetMalfunctionComponent,
        data: {
          title: 'Malfunction Stats'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticRoutingModule { }
