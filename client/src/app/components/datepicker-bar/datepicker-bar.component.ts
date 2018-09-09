import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datepicker-bar',
  templateUrl: './datepicker-bar.component.html',
  styleUrls: ['./datepicker-bar.component.scss']
})
export class DatepickerBarComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  constructor() {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  ngOnInit() {
  }

}
