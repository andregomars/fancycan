import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService, TransformService } from '../../services';
import { share, map, switchMap, tap } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { IOption } from 'ng-select';
// import * as moment from 'moment';
import { addDays, format, isSameDay } from 'date-fns';
import { getStyle, hexToRgba } from '@coreui/coreui-pro/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { ViewProfileState, SpnProfileState } from '../../states';

@Component({
  selector: 'app-compare-statistic',
  templateUrl: './compare-statistic.component.html',
  styleUrls: ['./compare-statistic.component.scss']
})
export class CompareStatisticComponent implements OnInit {
  @Select(ViewProfileState.fcode) fcode$: Observable<string>;
  @Select(SpnProfileState.spns) spns$: Observable<any[]>;
  // definitions$: Observable<any[]>;
  spnList$: Observable<any[]>;
  vehicleList$: Observable<any[]>;
  vehicleOptions$: Observable<any[]>;
  chartData1 = new Array<any>();
  chartData2 = new Array<any>();
  chartLabels: string[];
  vcode1: string;
  vcode2: string;

  // chart options start
  chartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          maxRotation: 25,
          // callback: function(tick, index, array) {
          //       return `${tick.split('-')[1]}/${tick.split('-')[2]}`;
          // }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          // stepSize: Math.ceil(400 / 5),
          // max: 400
        }
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
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: true
    }
  };

  chartColors: Array<any> = [
    {
      backgroundColor: hexToRgba(getStyle('--warning'), 50),
      borderColor: getStyle('--warning'),
      pointHoverBackgroundColor: '#fff'
    },
    {
      backgroundColor: hexToRgba(getStyle('--primary'), 50),
      borderColor: getStyle('--primary'),
      pointHoverBackgroundColor: '#fff'
    }
  ];
  // chart options end

  constructor(
    private dataService: DataService,
    // private utilityService: UtilityService
    private transformService: TransformService
  ) { }

  ngOnInit() {
    this.loadDefault();
    this.initChartLabels();
    this.loadChartData();
  }

  compare() {
    this.loadChartData();
  }

  private loadDefault() {
    // this.definitions$ = this.dataService.getDefinitions().pipe(
    //   share()
    // );

    this.spnList$ = this.spns$.pipe(
      map(defs => defs.map(def => {
        return {
          label: def.spn,
          value: def.spn
        };
      }))
    );

    // const fleets$ = this.dataService.getFleets();
    this.vehicleList$ = this.fcode$.pipe(
      // switchMap(fcode =>
      //   this.transformService.getViewProfileByFleetCode(fcode, fleets$)),
      switchMap(fcode =>
        this.dataService.getFleets().pipe(
          map((fleets: any[]) =>
            this.transformService.getViewProfileByFleetCode(fcode, fleets))
          )
        ),
      tap(x => console.log(x)),
      share()
    );

    this.vehicleOptions$ = this.vehicleList$.pipe(
      map(vehicles => vehicles.map(vehicle => {
        return {
          label: vehicle.vcode,
          value: vehicle.vcode
        } as IOption;
      }))
    );
  }

  private initChartLabels() {
    // ['2018-09-01', ...'2018-09-07']
    const daysofOneWeekLabels =
      // Array.from(new Array(7), (val, index) => moment('2018-09-01').add(index, 'days').format('YYYY-MM-DD') );
      Array.from(new Array(7), (val, index) => format(addDays(new Date(2019, 3, 7), index), 'YYYY-MM-DD'));
    this.chartLabels = daysofOneWeekLabels;
  }

  loadChartData() {
    this.dataService.getVehicleStats().subscribe(data => {
      const dateFormatedData1 = data.filter(s => s.vehicle_code === this.vcode1)
        .map(r => {
          return {
            date: r.updated,
            soc_charged: r.soc_charged,
            // soc_used: r.soc_used,
            energy_charged: r.energy_charged,
            // energy_used: r.energy_used,
          };
        });
      this.chartData1 =
        this.fillChartData(this.chartLabels, dateFormatedData1,
          // 'date', ['soc_charged', 'soc_used', 'energy_charged', 'energy_used']);
          'date', ['soc_charged', 'energy_charged']);

      const dateFormatedData2 = data.filter(s => s.vehicle_code === this.vcode2)
        .map(r => {
          return {
            date: r.updated,
            soc_charged: r.soc_charged,
            // soc_used: r.soc_used,
            energy_charged: r.energy_charged,
            // energy_used: r.energy_used,
          };
        });
      this.chartData2 =
        this.fillChartData(this.chartLabels, dateFormatedData2,
          // 'date', ['soc_charged', 'soc_used', 'energy_charged', 'energy_used']);
          'date', ['soc_charged', 'energy_charged']);
    });
  }

  private fillChartData(labels: string[], sourceData: any[], timeKey: string, keys: string[]): any[] {
    const output = keys.map((key) => {
      return {
        data: new Array<number>(),
        label: key
      };
    });

    for (const label of labels) {
      // const data = sourceData.find(s => moment(s[timeKey]).isSame(label));
      const data = sourceData.find(s => isSameDay(s[timeKey], label));
      for (let i = 0; i < keys.length; i++) {
        output[i].data.push(data ? data[keys[i]] : null);
      }
    }

    return output;
  }
}
