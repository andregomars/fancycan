import { Component, OnInit } from '@angular/core';
import { navItems } from './../../_nav';
import { Observable } from 'rxjs';
import { ViewProfile } from '../../model';
import { StorageService } from '../../services';
import { share } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  viewProfile$: Observable<ViewProfile>;
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
    this.viewProfile$ = this.storageService.watchViewProfile().pipe(
    );
  }

  resetViewProfile() {
    this.storageService.clearViewProfile();
    // this.viewProfile$ = this.storageService.watchViewProfile();
  }
}
