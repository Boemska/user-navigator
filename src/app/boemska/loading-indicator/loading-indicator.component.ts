import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AdapterService } from '../adapter.service';

import { Service } from '../service.interface';

@Component({
  selector: 'boemska-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss']
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy {
  public loading: boolean = false;
  public requests: Service[] = [];
  private _loadingSub: Subscription;

  constructor(private adapterService: AdapterService) { }

  ngOnInit(): void {
    this._loadingSub = this.adapterService.requestsChanged.subscribe(() => {
      this.requests = Array.from(this.adapterService.requests.values()).reverse();
      let loading = false;
      for (let file of this.requests) {
        if (file.running) {
          loading = true;
          break;
        }
      }
      this.loading = loading;
    });
  }

  ngOnDestroy(): void {
    this._loadingSub.unsubscribe();
  }
}
