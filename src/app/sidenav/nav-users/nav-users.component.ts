import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsergroupsService } from '../../usergroups.service';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-users',
  templateUrl: './nav-users.component.html',
  styleUrls: ['./nav-users.component.scss']
})
export class NavUsersComponent implements OnInit, OnDestroy {

  public userSub: Subscription;
  public userRow: Subscription;
  public sasMembers: Array<any> = [];
  public sasMembersAll: Array<any> = [];
  public filteredMembers: Array<string> = [];
  public memberName: string;
  public selectedRow: number;
  public totalUsers: number;
  public isPageReady: boolean = false;

  private _filter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _filterSub: Subscription;

  constructor(
    private _usergroupsService: UsergroupsService,
  ) { }

  ngOnInit() {

    this.userSub = this._usergroupsService.subUser.subscribe(
      async usr => {
        try {
          let response = await this._usergroupsService.getAllMembers();
          this.sasMembers = this.sasMembersAll = response.sasMembers;

        } catch (error) {
          console.log(error);
        }

        this.totalUsers = this.sasMembers.length;

        for (let i = 0; i < this.sasMembers.length; i++) {
          this.sasMembers[i].MEMBERNAME = this._usergroupsService.repairTxt(this.sasMembers[i].MEMBERNAME);
        }
        this.isPageReady = true;
      });

    this._filterSub = this._filter.debounceTime(100).distinctUntilChanged().subscribe(
      async (filter) => {
        this.sasMembers = this.sasMembersAll;
        this.filteredMembers = this.sasMembers.filter(
          data =>
            data.MEMBERNAME.toLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1
        );
        this.sasMembers = this.filteredMembers;
      });

    this.userRow = this._usergroupsService.selectedUser.subscribe(
      userRow => {
        this.selectedRow = userRow;
      });
  }

  public async selectUser(memberName: string, ind: number) {
    this.selectedRow = ind;
    this._usergroupsService.goToUser(memberName);
  }

  public onFilterInput(filter: string) {
    this._filter.next(filter);
  }

  public clearFilter() {
    this._filter.next(null);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.userRow.unsubscribe();
    this._filterSub.unsubscribe();
    this._usergroupsService.clearUser();
  }

}
