import { Component, OnInit } from '@angular/core';

import * as adapterLogs from 'h54s/src/logs';

@Component({
  selector: 'boemska-debug-logs',
  templateUrl: './debug-logs.component.html',
  styleUrls: ['./debug-logs.component.scss']
})
export class DebugLogsComponent implements OnInit {
  public logs: Array<any>[];

  constructor() { }

  ngOnInit() {
    this.logs = adapterLogs.get.getDebugData();
  }

}
