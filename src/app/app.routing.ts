import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home';
import {AdminComponent} from './admin';
import {LoginComponent} from './login';
import {AuthGuard} from './_helpers';
import {Role} from './_models';
import {UsersComponent} from '@app/users/users.component';
import {ForgottenPasswordComponent} from "@app/forgotten-password/forgotten-password.component";
import {ListFormsComponent} from "@app/list-forms/list-forms.component";
import {NewFormComponent} from '@app/new-form/new-form.component';
import {EditFormComponent} from '@app/edit-form/edit-form.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin]}
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { type: 'list' }
  },
  {
    path: 'users/new',
    component: UsersComponent,
    data: { type: 'new' }
  },
  {
    path: 'user/edit/:id',
    component: UsersComponent,
    data: { type: 'edit' }
  },
  {
    path: 'forgotten-password',
    component: ForgottenPasswordComponent,
    data: {}
  },

  // Forms
  {
    path: 'forms',
    component: ListFormsComponent,
    data: { type: 'list' },
    canActivate: [AuthGuard]
  },

  {
    path: 'new-form',
    component: NewFormComponent,
    data: { type: 'new' },
    canActivate: [AuthGuard]
  },

  {
    path: 'edit-form/:id',
    component: EditFormComponent,
    data: { type: 'edit' },
    canActivate: [AuthGuard]
  },

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const appRoutingModule = RouterModule.forRoot(routes);
