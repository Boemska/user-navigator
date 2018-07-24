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
    this._router.navigateByUrl("/users/" + memberName);
  };

  public async getAllMembers() {
    return await this._adapterService.call('Public/getAllMembers', null);
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
    this._router.navigateByUrl("/groups/" + groupName);
  };

  public async getAllGroups() {
    return await this._adapterService.call('Public/getAllGroups', null);
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
    this._router.navigateByUrl("/roles/" + roleName);
  };

  public async getAllRoles() {
    return await this._adapterService.call('Public/getAllRoles', null);
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
