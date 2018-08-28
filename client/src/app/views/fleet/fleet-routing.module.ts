import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { FleetComponent } from './fleet.component';
import { VehicleComponent } from './vehicle.component';

const routes: Routes = [
  {
    path: '',
    component: FleetComponent,
    data: {
      title: 'Fleet'
    },
    children: [
      {
        path: '/:vid',
        component: VehicleComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule {}
