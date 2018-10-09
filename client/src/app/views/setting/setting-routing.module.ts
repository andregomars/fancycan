import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { SpnSpecificationComponent } from './spn-specification.component';
import { SpnProprietaryComponent } from './spn-proprietary.component';
import { SettingContainerComponent } from './setting-container.component';
import { FleetGuard } from '../../guards/fleet.guard';

const routes: Routes = [
  {
    path: '',
    component: SettingContainerComponent,
    data: {
      title: 'Setting'
    },
    children: [
      {
        path: 'j1939',
        component: SpnSpecificationComponent,
        data: {
          title: 'J1939'
        }
      },
      {
        path: 'proprietary',
        component: SpnProprietaryComponent,
        canActivate: [ FleetGuard ],
        data: {
          title: 'Proprietary'
        }
      },
      {
        path: 'proprietary/:fcode',
        component: SpnProprietaryComponent,
        data: {
          title: 'Proprietary'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
