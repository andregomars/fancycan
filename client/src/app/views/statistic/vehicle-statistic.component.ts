import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable } from 'rxjs';
import { share, map, scan } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-vehicle-statistic',
  templateUrl: './vehicle-statistic.component.html',
  styleUrls: ['./vehicle-statistic.component.scss']
})
export class VehicleStatisticComponent implements OnInit {
  stats$: Observable<any>;
  sumEntry$: Observable<any>;
  avgEntry$: Observable<any>;
  topNum = 5;
  idleTimeLabels: string[];
  idleTimeValues: number[];
  regenLabels: string[];
  regenValues: number[];

  pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'right',
      labels: {
        fontColor: '#ffffff'
      }
    }
  };

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadTable();
    this.loadPieCharts();
  }

  private loadPieCharts() {
    this.stats$.subscribe((stats: any[]) => {
      const key = 'updated';
      const value = 'idle_time';
      const aggregated = this.utilityService.getAggregateData(stats, key, value);
      aggregated.sort((a, b) => b[value] - a[value]).splice(this.topNum);
      this.idleTimeLabels = aggregated.map(x => x[key]).map(this.formatDateForChart);
      this.idleTimeValues = aggregated.map(x => x[value]);
      }
    );
    this.stats$.subscribe((stats: any[]) => {
      const key = 'updated';
      const value = 'regeneration';
      const aggregated = this.utilityService.getAggregateData(stats, key, value);
      aggregated.sort((a, b) => b[value] - a[value]).splice(this.topNum);
      this.regenLabels = aggregated.map(x => x[key]).map(this.formatDateForChart);
      this.regenValues = aggregated.map(x => x[value]);
      }
    );
  }

  private formatDateForChart(date: string): string {
    return moment(date).format('MM/DD');
  }

  private loadTable() {
    this.stats$ = this.dataService.getVehicleStats().pipe(
      share()
    );

    const sumEntryInitial = {
      updated: null,
      odometer: 0,
      mileage: 0,
      engine_on: 0,
      idle_time: 0,
      max_speed: 0,
      regeneration: 0,
      count: 0
    };

    this.sumEntry$ = this.stats$.pipe(
      map((stats: any[]) => {
        return stats.reduce((sum, cur) => {
          return {
            updated: 'SUM',
            odometer: sum.odometer + cur.odometer,
            mileage: sum.mileage + cur.mileage,
            engine_on: sum.engine_on + cur.engine_on,
            idle_time: sum.idle_time + cur.idle_time,
            max_speed: sum.max_speed + cur.max_speed,
            regeneration: sum.regeneration + cur.regeneration,
            count: sum.count + 1
          };
        }, sumEntryInitial);
      }),
      share()
    );

    this.avgEntry$ = this.sumEntry$.pipe(
      map(sum => {
          return {
            updated: 'AVG',
            odometer: sum.odometer / sum.count,
            mileage: sum.mileage / sum.count,
            engine_on: sum.engine_on / sum.count,
            idle_time: sum.idle_time / sum.count,
            max_speed: sum.max_speed / sum.count,
            regeneration: sum.regeneration / sum.count,
            count: sum.count
          };
      })
    );
  }
}
