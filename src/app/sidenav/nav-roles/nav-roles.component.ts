import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UsergroupsService } from '../../usergroups.service';

@Component({
  selector: 'app-nav-roles',
  templateUrl: './nav-roles.component.html',
  styleUrls: ['./nav-roles.component.scss']
})
export class NavRolesComponent implements OnInit, OnDestroy {

  public roleSub: Subscription;
  public roleRow: Subscription;
  public sasRoles: Array<any> = [];
  public sasRolesAll: Array<any> = [];
  public filteredRoles: Array<string> = [];
  public roleName: string;
  public selectedRow: number;
  public totalRoles: number;
  public isPageReady: boolean = false;

  private _filter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _filterSub: Subscription;

  constructor(
    private _usergroupsService: UsergroupsService
  ) { }

  ngOnInit() {

    this.roleSub = this._usergroupsService.subRole.subscribe(
      async rl => {
        try {
          let response = await this._usergroupsService.getAllRoles();
          this.sasRoles = this.sasRolesAll = response.sasRoles;

        } catch (error) {
          console.log(error)
        }

        this.totalRoles = this.sasRoles.length;

        for (let i = 0; i < this.sasRoles.length; i++) {
          this.sasRoles[i].ROLENAME = this._usergroupsService.repairTxt(this.sasRoles[i].ROLENAME);
        }
        this.isPageReady = true;
      });

    this._filterSub = this._filter.debounceTime(100).distinctUntilChanged().subscribe(
      async (filter) => {
        this.sasRoles = this.sasRolesAll;
        this.filteredRoles = this.sasRoles.filter(
          data =>
            data.ROLENAME.toLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1
        );
        this.sasRoles = this.filteredRoles;
      });

    this.roleRow = this._usergroupsService.selectedRole.subscribe(
      roleRow => {
        this.selectedRow = roleRow;
      });
  }

  public async selectRole(roleName, ind: number) {
    this.selectedRow = ind;
    this._usergroupsService.goToRole(roleName);
  }

  public onFilterInput(filter: string) {
    this._filter.next(filter);
  }

  public clearFilter() {
    this._filter.next(null);
  }

  ngOnDestroy() {
    this.roleSub.unsubscribe();
    this.roleRow.unsubscribe();
    this._filterSub.unsubscribe();
    this._usergroupsService.clearRole();
  }
}
