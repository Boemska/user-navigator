import { TestBed, inject } from '@angular/core/testing';

import { AdapterService } from './adapter.service';
import { UserService } from './user.service';

import * as h54sError from 'h54s/src/error';

describe('AdapterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdapterService,
        UserService
      ]
    });
  });

  it('should be created', inject([AdapterService], (service: AdapterService) => {
    expect(service).toBeTruthy();
  }));

  it('test login event emit', done => {
    inject([AdapterService], async (service) => {
      spyOn(service._adapter, 'call').and.callFake(function (program, tables, callback) {
        callback(new h54sError('notLoggedinError', 'Fake login error'));
      });
      spyOn(service._adapter, 'login').and.callFake(function (user, pass, callback) {
        callback(200);
      });

      let shouldLogin;
      service.shouldLogin.subscribe(val => {
        shouldLogin = val;
      });

      service.call('p', null);
      expect(shouldLogin).toBe(true);
      await service.login('user', 'pass');
      expect(shouldLogin).toBe(false);

      done();
    })();
  });
});
