import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services';
import { User } from '../../models';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.users$ = this.authService.getAllUsers();
  }
}
