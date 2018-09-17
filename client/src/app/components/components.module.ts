import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule  } from 'ngx-bootstrap/datepicker';

import { TooltipLabelComponent } from './tooltip-label/tooltip-label.component';
import { DatepickerBarComponent } from './datepicker-bar/datepicker-bar.component';
import { NavLabelComponent } from './nav-label/nav-label.component';
import { SwitchComponent } from './switch/switch.component';
import { TransmissionSwitchComponent } from './transmission-switch/transmission-switch.component';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      TypeaheadModule,
      TooltipModule,
      BsDatepickerModule
  ],
  declarations: [
      TooltipLabelComponent,
      DatepickerBarComponent,
      NavLabelComponent,
      SwitchComponent,
      TransmissionSwitchComponent,
  ],
  exports: [
      TooltipLabelComponent,
      DatepickerBarComponent,
      NavLabelComponent,
      SwitchComponent,
      TransmissionSwitchComponent,
  ]
})
export class ComponentsModule { }
