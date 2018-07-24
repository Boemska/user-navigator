import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Alert } from './alert';

@Injectable()
export class AlertsService {
  public alerts: Subject<Alert> = new Subject<Alert>();

  constructor() { }

}
