import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UsergroupsService } from '../usergroups.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})

export class GroupsComponent implements OnInit, OnDestroy {
  public sasGroups: Array<any>;
  public members: Array<any> = [];
  public groupDesc: string = '';
  public groupName: string = '';
  public showUsersTable: boolean;
  public isDataReady: boolean = false;
  public groupSub: Subscription;

  constructor(
    private _usergroupsService: UsergroupsService,
    private _url: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.groupSub = this._url.params.subscribe(async (gr: Params) => {

      this.groupName = gr.groupName;
      this._usergroupsService.setGroup(this.groupName);

      try {
        let response = await this._usergroupsService.getAllGroups();
        this.sasGroups = response.sasGroups;

        for (let i = 0; i < this.sasGroups.length; i++) {
          this.sasGroups[i].GROUPNAME = this._usergroupsService.repairTxt(this.sasGroups[i].GROUPNAME);

          if (this.sasGroups[i].GROUPNAME === this.groupName) {
            this._usergroupsService.setSelectedGroup(i);
          }
        }
      } catch (error) {
        console.log(error);
      }

      if (this.groupName) {
        this.selectGroup(this.groupName);
      };
    });
  }

  public async selectGroup(groupName) {
    this._usergroupsService.goToGroup(groupName);

    let groupItem = this.sasGroups.filter(
      function (item) {
        return item.GROUPNAME === groupName;
      });

    try {
      let groupId = groupItem[0].GROUPURI;
      this.groupDesc = groupItem[0].GROUPDESC;
      this.groupDesc = this._usergroupsService.repairTxt(this.groupDesc)

      if (this.groupDesc === '') {
        this.groupDesc = "There is no description for this group";
      }

      let response = await this._usergroupsService.getMembersByGroup(groupId);
      this.members = response.sasMembers;

      this.showUsersTable = this.members.length > 0;
      this.isDataReady = true;

    } catch (error) {
      console.log(error);
    }
  }

  public goToUsers(memberName) {
    this._usergroupsService.goToUser(memberName);
  };

  ngOnDestroy() {
    this.groupSub.unsubscribe();
  }

}
