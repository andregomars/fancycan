import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { VehicleComponent } from './vehicle.component';
import { VehicleListComponent } from './vehicle-list.component';

const routes: Routes = [
    // { path: "", redirectTo: "list", pathMatch: "full" },
    { path: "", component: VehicleListComponent },
    { path: ":id", component: VehicleComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class VehicleRoutingModule { }
