import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions, PageRoute, LocationState } from 'nativescript-angular';

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
    // console.log('url: '+this.activeRoute.snapshot.url);
    // console.log('parent url: '+this.activeRoute.snapshot.parent.url);
    // console.log(this.pageRoute.activatedRoute.value)
    this.vcode = this.activeRoute.snapshot.params["id"];
  }

}
