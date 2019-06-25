import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { VehicleListComponent } from './vehicle-list.component';
import { VehicleStatesComponent } from './vehicle-states.component';

const routes: Routes = [
    { path: "", component: VehicleListComponent },
    { path: ":id", component: VehicleStatesComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
