import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchiveComponent } from './archive.component';
import { FleetGuard } from '../../guards/fleet.guard';

const routes: Routes = [
  {
    path: '',
    component: ArchiveComponent,
    canActivate: [ FleetGuard ],
    data: {
      title: 'Archive'
    }
  },
  {
    path: ':fcode',
    component: ArchiveComponent,
    data: {
      title: 'Archive'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveRoutingModule { }
