import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule  } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { TooltipLabelComponent } from './tooltip-label/tooltip-label.component';
import { DatepickerBarComponent } from './datepicker-bar/datepicker-bar.component';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      TooltipModule.forRoot(),
      TypeaheadModule.forRoot(),
      BsDatepickerModule.forRoot()
  ],
  declarations: [
      TooltipLabelComponent,
      DatepickerBarComponent
  ],
  exports: [
      TooltipLabelComponent,
      DatepickerBarComponent
  ]
})
export class ComponentsModule { }
