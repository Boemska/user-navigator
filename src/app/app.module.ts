import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ClarityModule } from 'clarity-angular';
import { AppComponent } from './app.component';
import { ROUTING } from "./app.routing";
import { NotFoundComponent } from './not-found/not-found.component';

import { UsersComponent } from './users/users.component';
import { GroupsComponent } from './groups/groups.component';
import { RolesComponent } from './roles/roles.component';
import { NavUsersComponent } from './sidenav/nav-users/nav-users.component';
import { NavGroupsComponent } from './sidenav/nav-groups/nav-groups.component';
import { NavRolesComponent } from './sidenav/nav-roles/nav-roles.component';
import { UsergroupsService } from './usergroups.service';

import { BoemskaModule } from './boemska/boemska.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    UsersComponent,
    GroupsComponent,
    RolesComponent,
    NavUsersComponent,
    NavGroupsComponent,
    NavRolesComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ClarityModule.forRoot(),
    ROUTING,
    BoemskaModule
  ],
  providers: [
    UsergroupsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
