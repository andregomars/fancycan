import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { Observable } from 'rxjs';
import { share, map, scan } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetProfile } from '../../actions';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'app-statistic-malfunction',
  templateUrl: './fleet-malfunction.component.html',
  styleUrls: ['./fleet-malfunction.component.scss']
})
export class FleetMalfunctionComponent implements OnInit {
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
    private store: Store,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadTable();
    this.loadPieCharts();
  }

  nav(fcode: string, vcode: string) {
    this.store.dispatch(new SetProfile(fcode, vcode, null, null));
    this.store.dispatch(new Navigate(['statistic/malfunction/vehicle', vcode]));
  }

  private loadPieCharts() {
    this.alerts$.subscribe((alerts: any[]) => {
      const aggregated = this.utilityService.getAggregateData(alerts, 'vehicle_number', 'total_alert');
      aggregated.sort((a, b) => b.total_alert - a.total_alert).splice(this.topNum);
      this.alertRateLabels = aggregated.map(x => x.vehicle_number);
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

  private loadTable() {
    this.alerts$ = this.dataService.getAlertStats().pipe(
      share()
    );

    const sumEntryInitial = {
      name: null,
      vehicle_number: null,
      odometer: 0,
      total_alert: 0,
      critical: 0,
      general: 0,
      spn: null,
      updated: null,
      count: 0
    };

    this.sumEntry$ = this.alerts$.pipe(
      map((alerts: any[]) => {
        return alerts.reduce((sum, cur) => {
          return {
            name: null,
            vehicle_number: 'SUM',
            odometer: sum.odometer + cur.odometer,
            total_alert: sum.total_alert + cur.total_alert,
            critical: sum.critical + cur.critical,
            general: sum.general + cur.general,
            spn: null,
            updated: null,
            count: sum.count + 1
          };
        }, sumEntryInitial);
      }),
      share()
    );

    this.avgEntry$ = this.sumEntry$.pipe(
      map(sum => {
          return {
            name: null,
            vehicle_number: 'AVG',
            odometer: sum.odometer / sum.count,
            total_alert: sum.total_alert / sum.count,
            critical: sum.critical / sum.count,
            general: sum.general / sum.count,
            spn: null,
            updated: null,
            count: sum.count
          };
      })
    );
  }
}
