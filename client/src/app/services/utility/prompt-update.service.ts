import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class PromptUpdateService {

  constructor(
    updates: SwUpdate,
    // location: Location
  ) {
    updates.available.subscribe(event => {
      const msg = `version updates from ${event.current} to ${event.available}`;
      if (confirm(msg)) {
        updates.activateUpdate().then(() =>
          window.location.reload());
      }
    });
  }
}
