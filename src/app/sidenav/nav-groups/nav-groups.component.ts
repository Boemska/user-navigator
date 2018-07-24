import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UsergroupsService } from '../../usergroups.service';

@Component({
  selector: 'app-nav-groups',
  templateUrl: './nav-groups.component.html',
  styleUrls: ['./nav-groups.component.scss']
})
export class NavGroupsComponent implements OnInit, OnDestroy {

  public groupSub: Subscription;
  public groupRow: Subscription;
  public sasGroups: Array<any> = [];
  public sasGroupsAll: Array<any> = [];
  public filteredGroups: Array<string> = [];
  public groupName: string;
  public selectedRow: number;
  public totalGroups: number;
  public isPageReady: boolean = false;

  private _filter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _filterSub: Subscription;

  constructor(
    private _usergroupsService: UsergroupsService
  ) { }

  ngOnInit() {

    this.groupSub = this._usergroupsService.subGroup.subscribe(
      async gr => {
        try {
          let response = await this._usergroupsService.getAllGroups();
          this.sasGroups = this.sasGroupsAll = response.sasGroups;

        } catch (error) {
          console.log(error);
        }

        this.totalGroups = this.sasGroups.length;

        for (let i = 0; i < this.sasGroups.length; i++) {
          this.sasGroups[i].GROUPNAME = this._usergroupsService.repairTxt(this.sasGroups[i].GROUPNAME);
        }
        this.isPageReady = true;
      });

    this._filterSub = this._filter.debounceTime(100).distinctUntilChanged().subscribe(
      async (filter) => {
        this.sasGroups = this.sasGroupsAll;
        this.filteredGroups = this.sasGroups.filter(
          data =>
            data.GROUPNAME.toLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1
        );
        this.sasGroups = this.filteredGroups;
      });

    this.groupRow = this._usergroupsService.selectedGroup.subscribe(
      groupRow => {
        this.selectedRow = groupRow;
      });
  }

  public selectGroup(groupName, ind: number) {
    this.selectedRow = ind;
    this._usergroupsService.goToGroup(groupName);
  }

  public onFilterInput(filter: string) {
    this._filter.next(filter);
  }

  public clearFilter() {
    this._filter.next(null);
  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
    this.groupRow.unsubscribe();
    this._filterSub.unsubscribe();
    this._usergroupsService.clearGroup();
  }

}
