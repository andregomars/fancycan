import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { TooltipLabelComponent } from './tooltip-label/tooltip-label.component';

@NgModule({
  imports: [
      CommonModule,
      TooltipModule.forRoot()
  ],
  declarations: [
      TooltipLabelComponent
  ],
  exports: [
      TooltipLabelComponent
  ]
})
export class ComponentsModule { }
