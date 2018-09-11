import { Component, OnInit } from '@angular/core';
import { navItems } from './../../_nav';
import { Observable, of } from 'rxjs';
import { StorageService } from '../../services';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  fcode$: Observable<string>;
  navItems = navItems;
  sidebarMinimized = true;
  element: HTMLElement = document.body;
  private changes: MutationObserver;

  constructor(
    private storageService: StorageService
  ) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  ngOnInit() {
    // this.fcode$ = of(localStorage.getItem('fcode'));
    this.fcode$ = this.storageService.watchFcode().pipe(
      tap(() => console.log('tap here'))
    );

  }
}
