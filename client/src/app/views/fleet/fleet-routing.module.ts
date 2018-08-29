import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { FleetComponent } from './fleet.component';
import { VehicleComponent } from './vehicle.component';
import { FleetOutletComponent } from './fleet-outlet.component';

const routes: Routes = [
  {
    path: '',
    component: FleetOutletComponent,
    data: {
      title: 'Fleet'
    },
    children: [
      {
        path: '',
        component: FleetComponent,
        data: {
          title: ' '
        }
      },
      {
        path: 'vehicle/:vid',
        component: VehicleComponent,
        data: {
          title: 'Vehicle'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule {}
