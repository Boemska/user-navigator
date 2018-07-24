import { TestBed, inject } from '@angular/core/testing';

import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertsService]
    });
  });

  it('should be created', inject([AlertsService], (service: AlertsService) => {
    expect(service).toBeTruthy();
  }));
});
