import { Component, OnInit } from '@angular/core';
import { UtilityService } from '~/app/services/utility.service';

@Component({
  selector: 'app-vehicle-states',
  templateUrl: './vehicle-states.component.html',
  styleUrls: ['./vehicle-states.component.css'],
  moduleId: module.id,
})
export class VehicleStatesComponent implements OnInit {
  spnProfile: any;

  constructor(
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.spnProfile = this.utilityService.getSpnProfile(); 
  }

}
