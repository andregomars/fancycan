import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import { SpnSpecificationComponent } from './spn-specification.component';
import { SettingContainerComponent } from './setting-container.component';

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
          title: 'Fleet List'
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
