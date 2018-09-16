import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { share, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spn-specification',
  templateUrl: './spn-specification.component.html',
  styleUrls: ['./spn-specification.component.scss']
})
export class SpnSpecificationComponent implements OnInit {
  definitions$: Observable<any>;
  specs$: Observable<any>;
  keyword: string;

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  filterSpec(keyword: string) {

  }

  private loadData() {
    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.specs$ = this.dataService.getSpnSpecs().pipe(
      map((specs: any[]) =>
        this.utilityService.getFlattedSPNSpecs(specs)),
      tap(x => console.log(x))
    );
  }
}
