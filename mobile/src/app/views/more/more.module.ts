import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { MoreRoutingModule } from './more-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    MoreRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MoreModule { }
