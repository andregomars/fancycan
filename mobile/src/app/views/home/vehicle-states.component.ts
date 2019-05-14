import { Component, OnInit } from '@angular/core';
import { getString } from "tns-core-modules/application-settings";

@Component({
  selector: 'app-vehicle-states',
  templateUrl: './vehicle-states.component.html',
  styleUrls: ['./vehicle-states.component.css'],
  moduleId: module.id,
})
export class VehicleStatesComponent implements OnInit {
  spnProfile: any;

  constructor() { }

  ngOnInit() {
    // this.spnProfile = JSON.parse(getString('spnProfile'));
    // console.log(this.spnProfile)
    
  }

}
