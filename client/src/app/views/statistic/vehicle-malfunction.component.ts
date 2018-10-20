import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable } from 'rxjs';
import { share, map, scan } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-vehicle-malfunction',
  templateUrl: './vehicle-malfunction.component.html',
  styleUrls: ['./vehicle-malfunction.component.scss']
})
export class VehicleMalfunctionComponent implements OnInit {
  alerts$: Observable<any>;
  sumEntry$: Observable<any>;
  avgEntry$: Observable<any>;
  topNum = 5;
  alertRateLabels: string[];
  alertRateValues: number[];
  alertTypeLabels: string[];
  alertTypeValues: number[];

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
    this.alerts$.subscribe((alerts: any[]) => {
      const aggregated = this.utilityService.getAggregateData(alerts, 'updated', 'total_alert');
      aggregated.sort((a, b) => b.total_alert - a.total_alert).splice(this.topNum);
      this.alertRateLabels = aggregated.map(x => x.updated).map(this.formatDateForChart);
      this.alertRateValues = aggregated.map(x => x.total_alert);
      }
    );
    this.alerts$.subscribe((alerts: any[]) => {
      const aggregated = this.utilityService.getAggregateData(alerts, 'name', 'total_alert');
      aggregated.sort((a, b) => b.total_alert - a.total_alert).splice(this.topNum);
      this.alertTypeLabels = aggregated.map(x => x.name);
      this.alertTypeValues = aggregated.map(x => x.total_alert);
      }
    );
  }

  private formatDateForChart(date: string): string {
    return moment(date).format('MM/DD');
  }

  private loadTable() {
    this.alerts$ = this.dataService.getAlertStats().pipe(
      share()
    );

    const sumEntryInitial = {
      updated: null,
      odometer: 0,
      total_alert: 0,
      critical: 0,
      general: 0,
      count: 0
    };

    this.sumEntry$ = this.alerts$.pipe(
      map((alerts: any[]) => {
        return alerts.reduce((sum, cur) => {
          return {
            updated: 'SUM',
            odometer: sum.odometer + cur.odometer,
            total_alert: sum.total_alert + cur.total_alert,
            critical: sum.critical + cur.critical,
            general: sum.general + cur.general,
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
            total_alert: sum.total_alert / sum.count,
            critical: sum.critical / sum.count,
            general: sum.general / sum.count,
            count: sum.count
          };
      })
    );
  }
}
