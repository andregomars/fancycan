import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { StatisticComponent } from './statistic.component';
import { FleetMalfunctionComponent } from './fleet-malfunction.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticComponent,
    data: {
      title: 'Statistic'
    },
    children: [
      {
        path: 'malfunction/fleet/:id',
        component: FleetMalfunctionComponent,
        data: {
          title: 'Malfunction'
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
