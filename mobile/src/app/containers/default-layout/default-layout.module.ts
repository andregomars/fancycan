import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { DefaultLayoutRoutingModule } from './default-layout-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { DefaultLayoutComponent } from './default-layout.component';

@NgModule({
  declarations: [
    DefaultLayoutComponent
  ],
  imports: [
    DefaultLayoutRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DefaultLayoutModule { }
