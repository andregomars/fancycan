import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {
  @Input() isSwitchOn: boolean;
  @Input() isDisabled = false;

  constructor() { }

  ngOnInit() {
  }

  clickSwitch($event: any) {
    $event.preventDefault();
  }

}
