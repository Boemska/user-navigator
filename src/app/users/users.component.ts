import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UsergroupsService } from '../usergroups.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit, OnDestroy {

  public sasMembers: Array<any>;
  public memberEmails: Array<any>;
  public memberGroups: Array<any>;
  public sasRoles: Array<any>;
  public memberName: string;
  public groupName: string = '';
  public roleName: string = '';
  public showEmailsTable: boolean;
  public showGroupsTable: boolean;
  public showRolesTable: boolean;
  public isDataReady: boolean = false;
  public userSub: Subscription;
  private _memberObject: any;

  constructor(
    private _url: ActivatedRoute,
    private _usergroupsService: UsergroupsService
  ) { }

  async ngOnInit() {
    this.userSub = this._url.params.subscribe(async (usr: Params) => {
      try {
        let response = await this._usergroupsService.getAllMembers();
        this.sasMembers = response.sasMembers;
      } catch (error) {
        console.log(error);
      }

      this.memberName = usr.memberName;
      this._usergroupsService.setUser(this.memberName);

      for (let i = 0; i < this.sasMembers.length; i++) {
        this.sasMembers[i].MEMBERNAME = this._usergroupsService.repairTxt(this.sasMembers[i].MEMBERNAME);
        if (this.sasMembers[i].MEMBERNAME === this.memberName) {
          this._usergroupsService.setSelectedUser(i);
        }
      }

      if (this.memberName) {
        this.selectUser(this.memberName);
      };
    })
  }

  public async selectUser(memberName) {
    this._usergroupsService.goToUser(memberName)

    try {
      this._memberObject = await this._usergroupsService.getGroupsByMember(this.memberName);
      this.memberEmails = this._memberObject.emails;
    } catch (error) {
      console.log(error);
    };

    // e-mail Table

    this.showEmailsTable = this.memberEmails.length > 0;

    // Groups Table

    this.memberGroups = this._memberObject.groups;

    for (let i = 0; i < this.memberGroups.length; i++) {
      this.memberGroups[i].GROUPNAME = this._usergroupsService.repairTxt(this.memberGroups[i].GROUPNAME);
    }

    this.showGroupsTable = this.memberGroups.length > 0;

    // Roles Table

    this.sasRoles = this._memberObject.roles;

    for (let i = 0; i < this.sasRoles.length; i++) {
      this.sasRoles[i].ROLE = this._usergroupsService.repairTxt(this.sasRoles[i].ROLENAME);
    }
    this.showRolesTable = this.sasRoles.length > 0;
    this.isDataReady = true;
  }

  public goToGroup(groupName) {
    this._usergroupsService.goToGroup(groupName);
  };

  public goToRole(roleName) {
    this._usergroupsService.goToRole(roleName);
  };

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
