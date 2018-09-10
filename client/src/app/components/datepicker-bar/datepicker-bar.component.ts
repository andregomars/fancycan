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
      { label: 'September - 09/2018', value: '2018-09-01' },
      { label: 'August - 08/2018', value: '2018-08-01' },
      { label: 'July - 07/2018', value: '2018-07-01' },
      { label: 'June - 06/2018', value: '2018-06-01' }
    ];
    this.years = [2018, 2017, 2016];

    // this.selectedMonth = { name: 'Sep', value: 9};
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

}
