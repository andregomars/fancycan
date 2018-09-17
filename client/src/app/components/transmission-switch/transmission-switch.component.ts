import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-transmission-switch',
  templateUrl: './transmission-switch.component.html',
  styleUrls: ['./transmission-switch.component.scss']
})
export class TransmissionSwitchComponent implements OnInit {
  @Input() shift: string;

  constructor() { }

  ngOnInit() {
  }

  clickSwitch($event: any) {
    $event.preventDefault();
  }

}
