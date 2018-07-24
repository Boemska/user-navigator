import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Alert } from './alert';
import { AlertsService } from './alerts.service';

@Component({
  selector: 'boemska-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  
  public alerts: Array<Alert> = [];
  public hasOpenAlert: boolean = false;
  public supportMail: string = 'support@boemskats.com';

  private _alertsSub: Subscription;

  constructor(private _alertsService: AlertsService) { }

  ngOnInit() {
    this._alertsSub = this._alertsService.alerts.subscribe((alert: Alert) => {
      this.alerts.push(alert);

      this.hasOpenAlert = true;

      if (alert.err) {
        console.error(alert.err);
      }
    });
  }

  public onAlertClose() {
    this.hasOpenAlert = this.alerts.some(alert => !alert.closed);
  }
}
