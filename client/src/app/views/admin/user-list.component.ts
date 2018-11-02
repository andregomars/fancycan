import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users$: Observable<any>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.users$ = this.dataService.getUsers();
  }
}
