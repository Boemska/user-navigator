import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsergroupsService } from './usergroups.service';
import { Params, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { VERSION } from 'environments/version';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  public version = VERSION.version;
  public hashPart = VERSION.hash;

  public navSection: string;
  public memberName: string;
  public groupName: string;
  public roleName: string;

  public subsciption: Subscription;
  private menuType: string;
  private _url: string = '';

  constructor(
    private _usergroupsService: UsergroupsService,
    private _router: Router,
  ) { }

  ngOnInit() {

    this.subsciption = this._router.events.subscribe(
      (link: Params) => {
        if (link instanceof NavigationEnd) {
          this._url = link.url;

          try {
            this.menuType = this._usergroupsService.getTypeFromUrl(this._url);
          } catch (error) {
            console.log(error);
          }

          if (this.menuType) {
            this.setNav(this.menuType);
          }
        }
      });

  }

  public setNav(nav: string) {
    this.navSection = nav;
  };

  ngOnDestroy() {
    this.subsciption.unsubscribe();
  }
}
