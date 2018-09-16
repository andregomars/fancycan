import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-label',
  templateUrl: './nav-label.component.html',
  styleUrls: ['./nav-label.component.scss']
})
export class NavLabelComponent implements OnInit {
  title: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.title = this.route.snapshot.data['title'];
  }

}
