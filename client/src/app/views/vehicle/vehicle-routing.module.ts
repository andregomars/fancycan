import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { VehicleComponent } from './vehicle.component';
import { VehicleListComponent } from './vehicle-list.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleListComponent,
    data: {
      title: 'Vehicles'
    }
  },
  {
    path: ':id',
    component: VehicleComponent,
    data: {
      title: 'Vehicle'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule {}
