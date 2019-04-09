import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

@Component({
  selector: 'app-vehicle-setting',
  templateUrl: './vehicle-setting.component.html',
  styleUrls: ['./vehicle-setting.component.css'],
  moduleId: module.id,
})
export class VehicleSettingComponent implements OnInit {

  constructor(
    private routerExtension: RouterExtensions
  ) { }

  ngOnInit() {
  }

  logoff() {
    this.routerExtension.navigate(['login'], { clearHistory: true });
    
  }

}
