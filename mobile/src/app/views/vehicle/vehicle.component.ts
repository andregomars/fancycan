import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
  moduleId: module.id,
})
export class VehicleComponent implements OnInit {
  vcode: string;

  constructor(
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.vcode = this.activeRoute.snapshot.params["id"];
  }

}
