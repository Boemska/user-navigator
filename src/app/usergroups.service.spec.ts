import { TestBed, inject } from '@angular/core/testing';

import { UsergroupsService } from './usergroups.service';

describe('UsergroupsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsergroupsService]
    });
  });

  it('should be created', inject([UsergroupsService], (service: UsergroupsService) => {
    expect(service).toBeTruthy();
  }));
});
