import { TestBed } from '@angular/core/testing';

import { Dm1AlertService } from './dm1-alert.service';

describe('Dm1AlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Dm1AlertService = TestBed.get(Dm1AlertService);
    expect(service).toBeTruthy();
  });
});
