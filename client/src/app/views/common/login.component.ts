import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.email = 'admin@fancycan.com';
    this.password = 'Pa20090508';
  }

  login() {
    this.authService.signIn(this.email, this.password);
  }
}
