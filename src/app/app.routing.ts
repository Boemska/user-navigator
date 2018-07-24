/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { GroupsComponent } from './groups/groups.component';
import { RolesComponent } from './roles/roles.component';

import { NotFoundComponent } from './not-found/not-found.component';

import { ApplicationLogsComponent } from './boemska/logs/application-logs/application-logs.component';
import { DebugLogsComponent } from './boemska/logs/debug-logs/debug-logs.component';
import { FailedRequestsComponent } from './boemska/logs/failed-requests/failed-requests.component';
import { ErrorsComponent } from './boemska/logs/errors/errors.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'users/:memberName', component: UsersComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'groups/:groupName', component: GroupsComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'roles/:roleName', component: RolesComponent },

  { path: 'application-logs', component: ApplicationLogsComponent },
  { path: 'debug-logs', component: DebugLogsComponent },
  { path: 'failed-requests', component: FailedRequestsComponent },
  { path: 'errors', component: ErrorsComponent },

  { path: '**', component: NotFoundComponent }
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTES, {useHash: true});
