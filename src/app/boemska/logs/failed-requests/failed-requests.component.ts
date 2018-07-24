import { Component, OnInit } from '@angular/core';

import * as adapterLogs from 'h54s/src/logs';

@Component({
  selector: 'boemska-failed-requests',
  templateUrl: './failed-requests.component.html',
  styleUrls: ['./failed-requests.component.scss']
})
export class FailedRequestsComponent implements OnInit {
  public logs: Array<any>[];

  constructor() { }

  ngOnInit() {
    this.logs = adapterLogs.get.getFailedRequests();
  }

}
