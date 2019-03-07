import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { UtilityService } from '../../services';

@Component({
  selector: 'app-play-chart',
  templateUrl: './play-chart.component.html',
  styleUrls: ['./play-chart.component.scss']
})
export class PlayChartComponent implements OnInit, OnDestroy {
  isPlaying: boolean;
  itv: any;
  source$: Observable<any>;
  queue: any[];
  @Input() len: number;
  @Input() intSec: number;
  @Input() labels: string[];
  @Input() data$: Observable<any>;

  lineChartLegend = false;
  lineChartType = 'line';

  regularChartOptions: any = {
    responsive: true,
    animation: {
      duration: 4000
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        ticks: {
          max: 100,
          beginAtZero: true
        }
      }]
    }
  };

  thumbnailChartOptions: any = {
    responsive: true,
    animation: {
      duration: 1000
    },
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };

  regularChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
  ];

  thumbnailChartColors: Array<any> = [
    {
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    }

  ];
  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.initData();
    this.loadDataPeriodically();
  }

  ngOnDestroy() {
    this.clear();
  }

  reload() {
    this.clear();
    this.initData();
    this.loadDataPeriodically();
  }

  pause() {
    this.isPlaying = !this.isPlaying;
    this.clear();
  }

  play() {
    this.isPlaying = !this.isPlaying;
    this.loadDataPeriodically();
  }

  private clear() {
    if (this.itv) {
      clearInterval(this.itv);
    }
  }

  private initData() {
    this.isPlaying = true;
    this.queue = Array.from(new Array(this.len), () => {
      return { time: '', num: '' };
    });
  }

  private loadDataPeriodically() {
    this.itv = setInterval(() => {
      this.loadData();
    }, this.intSec * 1000);
  }

  private loadData() {
    // this.source$ = this.utilityService.getCurrentData().pipe(
    this.source$ = this.data$.pipe(
      map(data => {
        this.queue.shift();
        const formatedData = this.utilityService.formatDataTime(data);
        this.queue.push(formatedData);
        const queue = [...this.queue];
        return {
          chartData: queue.map(q => q.num)
        };
      }),
    );

  }

}
