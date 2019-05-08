import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  moduleId: module.id,
})
export class ProfileComponent implements OnInit {

  constructor(
    private routerExtension: RouterExtensions
  ) { }

  ngOnInit() {
  }

  logoff() {
    this.routerExtension.navigate(['login'], { clearHistory: true });
    
  }

}
