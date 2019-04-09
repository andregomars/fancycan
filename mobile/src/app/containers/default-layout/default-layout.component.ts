import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css'],
  moduleId: module.id,
})
export class DefaultLayoutComponent implements OnInit {

  constructor(
    private routerExtension: RouterExtensions,
    private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.redirect();
  }

  private redirect() {
    this.routerExtension.navigate(
      [
        { 
          outlets: 
          { 
            homeTab: ['home'],
            scanTab: ['scan'],
            moreTab: ['more'] 
          }
        }
      ], 
      { relativeTo: this.activeRoute }
    );
  }

}
