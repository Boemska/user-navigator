import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AdapterService } from '../adapter.service';

interface User {
  user?: string
  pass?: string
}

@Component({
  selector: 'boemska-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;
  public isActive: boolean;
  public loading: boolean = false;
  public alertClosed: boolean = true;
  public errorMsg: string;
  public data: User = {
    user: null,
    pass: null
  };

  constructor(private adapter: AdapterService) { }

  ngOnInit() {
    this._subscription = this.adapter.shouldLogin.subscribe(shouldLogin => {
      this.isActive = shouldLogin;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public submit() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.adapter.login(this.data.user, this.data.pass).then(status => {
      this.loading = false;

      switch (status) {
        case -1:
          this.errorMsg = 'Username or password invalid';
          this.alertClosed = false;
          break;
        case -2:
          this.errorMsg = 'Problem communicating with server';
          this.alertClosed = false;
          break;
        case 200:
          this.errorMsg = null;
          break;
        default:
          this.errorMsg = 'Error with status code ' + status;
          this.alertClosed = false;
      }
    }).catch(err => {
      this.loading = false;
      this.errorMsg = err.message;
      this.alertClosed = false;
      console.error(err);
    });
  }

}
