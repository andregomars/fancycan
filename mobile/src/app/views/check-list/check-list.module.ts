import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { CheckListRoutingModule } from './check-list-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { CheckListComponent } from './check-list.component';

@NgModule({
  declarations: [CheckListComponent],
  imports: [
    CheckListRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CheckListModule { }
