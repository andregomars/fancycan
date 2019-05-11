import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { VehicleComponent } from './vehicle.component';
import { VehicleListComponent } from './vehicle-list.component';
import { VehicleStatesComponent } from './vehicle-states.component';

const routes: Routes = [
    // { path: "", redirectTo: "list", pathMatch: "full" },
    { path: "", component: VehicleListComponent },
    // { path: ":id", component: VehicleComponent }
    { path: ":id", component: VehicleStatesComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
