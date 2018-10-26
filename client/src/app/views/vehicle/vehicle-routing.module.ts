import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { VehicleComponent } from './vehicle.component';
import { VehicleListComponent } from './vehicle-list.component';
import { FleetGuard } from '../../guards/fleet.guard';
import { VehicleContainerComponent } from './vehicle-container.component';
import { RtmComponent } from './rtm.component';
import { VehicleGuard } from '../../guards/vehicle.guard';
import { PlaybackComponent } from './playback.component';
import { MalfunctionListComponent } from './malfunction-list.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleContainerComponent,
    data: {
      title: ''
    },
    children: [
      {
        path: 'list',
        component: VehicleListComponent,
        canActivate: [FleetGuard],
        data: {
          title: 'Vehicles'
        }
      },
      {
        path: 'list/:vcode',
        component: VehicleListComponent,
        data: {
          title: 'Vehicles'
        }
      },
      {
        path: 'rtm',
        component: RtmComponent,
        canActivate: [VehicleGuard],
        data: {
          title: 'Realtime Monitor'
        }
      },
      {
        path: 'rtm/:vcode',
        component: RtmComponent,
        data: {
          title: 'Realtime Monitor'
        }
      },
      {
        path: 'playback',
        component: PlaybackComponent,
        canActivate: [VehicleGuard],
        data: {
          title: 'Playback'
        }
      },
      {
        path: 'playback/:vcode',
        component: PlaybackComponent,
        data: {
          title: 'Playback'
        }
      },
      {
        path: 'snapshot',
        component: VehicleComponent,
        canActivate: [VehicleGuard],
        data: {
          title: 'Vehicle'
        }
      },
      {
        path: 'snapshot/:vcode',
        component: VehicleComponent,
        data: {
          title: 'Vehicle'
        }
      },
      {
        path: 'malfunctions',
        component: MalfunctionListComponent,
        canActivate: [VehicleGuard],
        data: {
          title: 'Malfunctions'
        }
      },
      {
        path: 'malfunctions/:vcode',
        component: MalfunctionListComponent,
        data: {
          title: 'Malfunctions'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
