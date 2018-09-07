import { Injectable } from '@angular/core';
import { AdapterService } from './boemska/adapter.service';
import { Router } from '@angular/router'
import { Subject } from 'rxjs';


@Injectable()

export class UsergroupsService {

  public isLoaded: boolean = false;
  public menuType: string = 'user';

  public subUser = new Subject<any>();
  public selectedUser = new Subject<number>();
  public subGroup = new Subject<any>();
  public selectedGroup = new Subject<number>();
  public subRole = new Subject<any>();
  public selectedRole = new Subject<number>();

  public allMembers: Array<string> = [];
  public allGroups: Array<string> = [];
  public allRoles: Array<string> = [];

  constructor(
    private _adapterService: AdapterService,
    private _router: Router,
  ) { }

  // Users -------------------------------------------------

  public setUser(user: string) {
    this.subUser.next(user);
  };

  public setSelectedUser(userNo: number) {
    this.selectedUser.next(userNo);
  };

  public getUser() {
    return this.subUser.asObservable();
  };

  public getSelectedUser() {
    return this.selectedUser.asObservable();
  };

  public clearUser() {
    this.selectedUser.next(null);
  };

  public goToUser(memberName) {
    this._router.navigateByUrl("/users/" + this.repairTxt_2F(memberName));
  };

  public async getAllMembers() {
    let data = await this._adapterService.call('Public/getAllMembers', null);
    this.allMembers = data.sasMembers;
    return this.allMembers;
  };

  public getGroupsByMember(memberName: string) {
    let data = this._adapterService.createData([{
      "username": memberName
    }
    ], 'iwant');

    try {
      let response = this._adapterService.call('Public/getGroupsByMember', data);
      return response;
    } catch (err) {
      // TODO: handle error
      console.log(err);
    }
  };

  //  Groups ------------------------------------------------

  public setGroup(group: string) {
    this.subGroup.next(group);
  };

  public showGroup() {
    return this.subGroup.asObservable();
  };

  public setSelectedGroup(groupNo: number) {
    this.selectedGroup.next(groupNo);
  };

  public getSelectedGroup() {
    return this.selectedGroup.asObservable();
  };

  public clearGroup() {
    this.selectedGroup.next(null);
  };

  public goToGroup(groupName) {
    this._router.navigateByUrl("/groups/" + this.repairTxt_2F(groupName));
  };

  public async getAllGroups() {
    let data = await this._adapterService.call('Public/getAllGroups', null);
    this.allGroups = data.sasGroups;
    return this.allGroups;
  };

  public async getMembersByGroup(groupId: string) {
    const data = this._adapterService.createData([{
      "groupid": groupId
    }
    ], 'iwant');

    try {
      let response = await this._adapterService.call('Public/getMembersByGroup', data);
      return response;
    } catch (err) {
      // TODO: handle error
      console.log(err);
    }
  };

  // Roles --------------------------------------------------

  public setRole(role: string) {
    this.subRole.next(role);
  };

  public setSelectedRole(roleNo: number) {
    this.selectedRole.next(roleNo);
  };

  public showRole() {
    return this.subRole.asObservable();
  };

  public getSelectedRole() {
    return this.selectedRole.asObservable();
  };

  public clearRole() {
    this.selectedRole.next(null);
  };

  public goToRole(roleName) {
    this._router.navigateByUrl("/roles/" + this.repairTxt_2F(roleName));
  };

  public async getAllRoles() {
    let data = await this._adapterService.call('Public/getAllRoles', null);
    this.allRoles = data.sasRoles;
    return this.allRoles;
  };

  public getMembersByRole(roleName: string) {
    let data = this._adapterService.createData([{
      "roleid": roleName
    }
    ], 'iwant');

    try {
      let response = this._adapterService.call('Public/getMembersByRole', data);
      return response;
    } catch (err) {
      // TODO: handle error
      console.log(err);
    }
  };

  public repairTxt(inputTxt): string {
    return inputTxt.replace(/%20/g, ' ');
  };

  public repairTxt_2F(inputTxt): string {
    return inputTxt.replace(/\//g, '%2F');
  };

  public getParamFromUrl(url: string): string {
    if (url) {
      let data: Array<string> = url.split("/");
      return data[data.length - 1];
    }
  };

  public getTypeFromUrl(url: string): string {

    if (url) {
      let data: Array<string> = url.split("/");

      if (data[data.length - 2]) {
        this.menuType = data[data.length - 2];
      } else {
        this.menuType = data[data.length - 1];
      }

      if (!this.menuType) {
        this.menuType = 'users';
      }

      return this.menuType;
    }
  };

}
