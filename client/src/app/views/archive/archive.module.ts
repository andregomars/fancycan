import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { SelectModule } from 'ng-select';

import { ArchiveRoutingModule } from './archive-routing.module';
import { ArchiveComponent } from './archive.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule,
    TimepickerModule,
    SelectModule,
    ArchiveRoutingModule
  ],
  declarations: [ArchiveComponent]
})
export class ArchiveModule { }
