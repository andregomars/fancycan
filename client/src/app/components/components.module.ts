import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule  } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';

import { TooltipLabelComponent } from './tooltip-label/tooltip-label.component';
import { DatepickerBarComponent } from './datepicker-bar/datepicker-bar.component';
import { NavLabelComponent } from './nav-label/nav-label.component';
import { SwitchComponent } from './switch/switch.component';
import { TransmissionSwitchComponent } from './transmission-switch/transmission-switch.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { PlayChartComponent } from './play-chart/play-chart.component';

@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      ChartsModule,
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
      ProgressBarComponent,
      PlayChartComponent,
  ],
  exports: [
      TooltipLabelComponent,
      DatepickerBarComponent,
      NavLabelComponent,
      SwitchComponent,
      TransmissionSwitchComponent,
      ProgressBarComponent,
      PlayChartComponent,
  ]
})
export class ComponentsModule { }
