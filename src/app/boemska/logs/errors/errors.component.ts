import { Component, OnInit } from '@angular/core';

import * as adapterLogs from 'h54s/src/logs';

@Component({
  selector: 'boemska-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {
  public logs: Array<any>[];

  constructor() { }

  ngOnInit() {
    this.logs = adapterLogs.get.getSasErrors();
  }

}
