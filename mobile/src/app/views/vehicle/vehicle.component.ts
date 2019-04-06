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
    console.log(this.activeRoute.snapshot.url);
    console.log(this.activeRoute.snapshot.parent.url);
    console.log(this.activeRoute.snapshot.root.url);
    this.vcode = this.activeRoute.snapshot.params["id"];
  }

}
