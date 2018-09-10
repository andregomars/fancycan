import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule  } from 'ngx-bootstrap/datepicker';
// import { SelectModule } from 'ng-select';

import { TooltipLabelComponent } from './tooltip-label/tooltip-label.component';
import { DatepickerBarComponent } from './datepicker-bar/datepicker-bar.component';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
    //   SelectModule,
      TypeaheadModule.forRoot(),
      TooltipModule.forRoot(),
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
