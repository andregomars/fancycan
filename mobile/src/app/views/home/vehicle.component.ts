import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
  moduleId: module.id,
})
export class VehicleComponent implements OnInit {
  vcode: string;

  constructor(
    // private routerExt: RouterExtensions,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // console.log(this.routerExt.router.routerState.snapshot.url)
    this.vcode = this.activeRoute.snapshot.params["id"];
  }

}
