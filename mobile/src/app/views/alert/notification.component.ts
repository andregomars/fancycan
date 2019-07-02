import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '~/app/services/data.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  moduleId: module.id,
})
export class NotificationComponent implements OnInit {
  alerts$: Observable<any>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.alerts$ = this.dataService.getAlerts();
  }

}
