import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as h54s from 'h54s';
import * as SasData from 'h54s/src/sasData';

import { Service } from './service.interface';
import { UserService } from './user.service';

import { AdapterSettings } from './h54s.config';

@Injectable()
export class AdapterService {
  public requests: Map<Promise<any>, Service> = new Map();
  public requestsChanged: Subject<null> = new Subject<null>();
  public shouldLogin: Subject<boolean> = new Subject<boolean>();
  private _debugMode: boolean;
  private _adapter: h54s;

  constructor(private _userService: UserService) {
    this._adapter = new h54s(AdapterSettings);
    // setting it here to invoke setter method
    this.debugMode = true;
  }

  public login(user, pass): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        this._adapter.login(user, pass, status => {
          if (status === 200) {
            this.shouldLogin.next(false);
          }
          resolve(status);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public call(program, tables): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this._adapter.call(program, tables, (err, res) => {
        if (err) {
          if (err.type === 'notLoggedinError') {
            return this.shouldLogin.next(true);
          } else {
            return reject(err);
          }
        }

        let user = this._userService.user.getValue();
        if (!user && res && res.userInfo && res.userInfo.length > 0) {
          this._userService.user.next({
            username: res.userInfo[0].USERNAME,
            pictureUrl: res.userInfo[0].PICTUREURL
          });
        } else if (!user && res && res.requestingPerson) {
          this._userService.user.next({
            username: res.requestingPerson
          });
        }

        resolve(res);
      });
    });

    this.requests.set(promise, {
      program,
      running: true,
      successful: null
    });
    this.requestsChanged.next();

    promise.then(() => {
      let request = this.requests.get(promise);
      request.running = false;
      request.successful = true;
      this.requestsChanged.next();
    }).catch(() => {
      let request = this.requests.get(promise);
      request.running = false;
      request.successful = false;
      this.requestsChanged.next();
    });

    return promise;
  }

  public logout(): Promise<null | Error> {
    return new Promise((resolve, reject) => {
      this._adapter.logout(errStatus => {
        if (errStatus !== undefined) {
          reject(new Error(`Logout failed with status code ${status}`));
        } else {
          resolve();
          this._userService.user.next(null);
        }
      });
    });
  }

  public get debugMode() {
    return this._debugMode;
  }

  public set debugMode(debugMode: boolean) {
    this._debugMode = this._adapter.debug = debugMode;
  }

  public createData(rows: Array<any>, name: string): SasData {
    return new SasData(rows, name);
  }
}
