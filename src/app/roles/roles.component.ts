import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UsergroupsService } from '../usergroups.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit, OnDestroy {
  public sasRoles: Array<any>;
  public members: Array<any> = [];
  public roleDesc: string = '';
  public roleName: string = '';
  public showUsersTable: boolean;
  public isDataReady: boolean = false;
  public roleSub: Subscription;

  constructor(
    private _usergroupsService: UsergroupsService,
    private _url: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.roleSub = this._url.params.subscribe(async (rl: Params) => {

      this.roleName = rl.roleName;
      this._usergroupsService.setRole(this.roleName);

      try {
        let response = await this._usergroupsService.getAllRoles();
        this.sasRoles = response.sasRoles;

        for (let i = 0; i < this.sasRoles.length; i++) {
          this.sasRoles[i].ROLENAME = this._usergroupsService.repairTxt(this.sasRoles[i].ROLENAME);

          if (this.sasRoles[i].ROLENAME === this.roleName) {
            this._usergroupsService.setSelectedRole(i);
          }
        }
      } catch (error) {
        console.log(error);
      }

      if (this.roleName) {
        this.selectRole(this.roleName);
      };
    });
  }

  public async selectRole(roleName) {
    this._usergroupsService.goToRole(roleName);

    let roleItem = this.sasRoles.filter(
      function (item) {
        return item.ROLENAME === roleName;
      });

    try {
      let roleId = roleItem[0].ROLEURI;
      this.roleDesc = roleItem[0].ROLEDESC;
      this.roleDesc = this._usergroupsService.repairTxt(this.roleDesc);

      if (this.roleDesc === '') {
        this.roleDesc = 'There is no description for this role';
      }

      let response = await this._usergroupsService.getMembersByRole(roleId);
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
    this.roleSub.unsubscribe();
  }

}
