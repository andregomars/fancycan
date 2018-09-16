import { Component, OnInit } from '@angular/core';
import { DataService, UtilityService } from '../../services';
import { share, map, tap, debounce } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-spn-specification',
  templateUrl: './spn-specification.component.html',
  styleUrls: ['./spn-specification.component.scss']
})
export class SpnSpecificationComponent implements OnInit {
  definitions$: Observable<any>;
  specs$: Observable<any>;
  filteredSpecs$: Observable<any>;
  keyword: string;
  specHideInDetails = ['SPNNo', 'SPNName', 'SPNDescription',
    'Status'];

  constructor(
    private dataService: DataService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.loadData();
    this.filteredSpecs$ = this.specs$;
  }

  filterSpec(keyword: string) {
    if (!keyword || keyword.length === 0) {
      this.loadData();
      return;
    }

    keyword = keyword.toUpperCase();
    this.filteredSpecs$ = this.specs$.pipe(
      debounce(() => timer(300)),
      map(specs =>
        specs.filter(spec =>
          spec.SPNNo === keyword
          || spec.PGNNo.indexOf(keyword) > -1
          || spec.SPNName.toUpperCase().indexOf(keyword) > -1
        )
      )
    );

  }

  isSpecDetail(key: string): boolean {
    return this.specHideInDetails.indexOf(key) < 0;
  }

  private loadData() {
    this.definitions$ = this.dataService.getDefinitions().pipe(
      share()
    );

    this.specs$ = this.dataService.getSpnSpecs().pipe(
      map((specs: any[]) =>
        this.utilityService.getFlattedSPNSpecs(specs)),
      share()
    );
  }
}
