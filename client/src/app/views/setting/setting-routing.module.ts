import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { SpnSpecificationComponent } from './spn-specification.component';
import { SpnProprietaryComponent } from './spn-proprietary.component';
import { SpnDefinitionComponent } from './spn-definition.component';
import { SettingContainerComponent } from './setting-container.component';
import { MalfunctinoSettingComponent } from './malfunction-setting.component';
import { UsageSettingComponent } from './usage-setting.component';
import { FleetGuard } from '../../guards/fleet.guard';
import { VehicleTemplateComponent } from './vehicle-template.component';
import { FleetSettingComponent } from './fleet-setting.component';

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
      },
      {
        path: 'definition',
        component: SpnDefinitionComponent,
        canActivate: [ FleetGuard ],
        data: {
          title: 'Definition'
        }
      },
      {
        path: 'definition/:fcode',
        component: SpnDefinitionComponent,
        data: {
          title: 'Definition'
        }
      },
      {
        path: 'malfunction',
        component: MalfunctinoSettingComponent,
        canActivate: [ FleetGuard ],
        data: {
          title: 'Malfunction'
        }
      },
      {
        path: 'malfunction/:fcode',
        component: MalfunctinoSettingComponent,
        data: {
          title: 'Malfunction'
        }
      },
      {
        path: 'usage',
        component: UsageSettingComponent,
        canActivate: [ FleetGuard ],
        data: {
          title: 'Usage'
        }
      },
      {
        path: 'usage/:fcode',
        component: UsageSettingComponent,
        data: {
          title: 'Usage'
        }
      },
      {
        path: 'vehicle-template',
        component: VehicleTemplateComponent,
        canActivate: [ FleetGuard ],
        data: {
          title: 'Vehicle Template'
        }
      },
      {
        path: 'vehicle-template/:fcode',
        component: VehicleTemplateComponent,
        data: {
          title: 'Vehicle Template'
        }
      },
      {
        path: 'fleet',
        component: FleetSettingComponent,
        canActivate: [ FleetGuard ],
        data: {
          title: 'Fleet'
        }
      },
      {
        path: 'fleet/:fcode',
        component: FleetSettingComponent,
        data: {
          title: 'Fleet'
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
