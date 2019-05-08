import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AlertRoutingModule } from './alert-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NotificationComponent } from './notification.component';

@NgModule({
  declarations: [NotificationComponent],
  imports: [
    AlertRoutingModule,
    NativeScriptCommonModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AlertModule { }
