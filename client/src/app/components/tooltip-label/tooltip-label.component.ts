import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../../services';

@Component({
  selector: 'app-tooltip-label',
  templateUrl: './tooltip-label.component.html',
  styleUrls: ['./tooltip-label.component.scss']
})
export class TooltipLabelComponent implements OnInit {
  @Input() label: string;
  tooltip$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    const url = this.getUrlWithoutParams();
    this.tooltip$ = this.dataService.getToolTip(this.label, url);
  }

  // e.g. localhost:4200/#/fleet/vehicle/5001 => /fleet/vehicle
  private getUrlWithoutParams() {
    const url = this.router.url;
    const params = this.route.snapshot.params;
    const urlSegments = url.split('/');
    if (params) {
      urlSegments.pop();
    }
    const urlNoParams = urlSegments.join('/');

    return urlNoParams;
  }
}
