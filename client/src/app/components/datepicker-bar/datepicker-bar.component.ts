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
  months: any[];
  years: number[];
  selectedMonth: any;
  selectedYear: number;

  constructor() {
  }

  ngOnInit() {
    this.months = [
      { name: 'Sep', value: 9 },
      { name: 'Aug', value: 8 },
      { name: 'Jul', value: 7 },
      { name: 'Jun', value: 6 }
    ];
    this.years = [2018, 2017, 2016, 2015];

    // this.selectedMonth = { name: 'Sep', value: 9};
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

}
