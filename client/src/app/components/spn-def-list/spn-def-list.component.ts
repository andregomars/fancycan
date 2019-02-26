import { Component, OnInit } from '@angular/core';
import { SpnProfileState } from '../../states';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-spn-def-list',
  templateUrl: './spn-def-list.component.html',
  styleUrls: ['./spn-def-list.component.scss']
})
export class SpnDefListComponent implements OnInit {
  @Select(SpnProfileState.spns) spns$: Observable<any[]>;

  constructor() { }

  ngOnInit() {
  }

}
