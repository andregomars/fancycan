import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UserListComponent } from './user-list.component';
import { AdminContainerComponent } from './admin-container.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [UserListComponent, AdminContainerComponent]
})
export class AdminModule { }
