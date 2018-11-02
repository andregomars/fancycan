import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminContainerComponent } from './admin-container.component';
import { UserListComponent } from './user-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminContainerComponent,
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: 'users',
        component: UserListComponent,
        data: {
          title: 'Users'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
