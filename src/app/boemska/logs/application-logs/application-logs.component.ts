import { Component, OnInit } from '@angular/core';

import * as adapterLogs from 'h54s/src/logs';

@Component({
  selector: 'boemska-application-logs',
  templateUrl: './application-logs.component.html',
  styleUrls: ['./application-logs.component.scss']
})
export class ApplicationLogsComponent implements OnInit {
  public logs: Array<any>[];

  constructor() { }

  ngOnInit() {
    this.logs = adapterLogs.get.getApplicationLogs();
  }

}
