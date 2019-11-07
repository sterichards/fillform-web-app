import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home';
import {AdminComponent} from './admin';
import {LoginComponent} from './login';
import {AuthGuard} from './_helpers';
import {Role} from './_models';
import {AudioComponent} from '@app/audio/audio.component';
import {DocumentComponent} from '@app/document/document.component';
import {VideoComponent} from '@app/video/video.component';
import {UsersComponent} from '@app/users/users.component';
import {DocumentCategoryComponent} from '@app/document-category/document-category.component';
import {ForgottenPasswordComponent} from "@app/forgotten-password/forgotten-password.component";

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
    path: 'audio',
    component: AudioComponent,
    data: { type: 'list' }
  },
  {
    path: 'audio/new',
    component: AudioComponent,
    data: { type: 'new' }
  },
  {
    path: 'audio/edit/:id',
    component: AudioComponent,
    data: { type: 'edit' }
  },
  {
    path: 'audio/edit-order',
    component: AudioComponent,
    data: { type: 'editorder' }
  },
  {
    path: 'document',
    component: DocumentComponent,
    data: { type: 'list' }
  },
  {
    path: 'document/new',
    component: DocumentComponent,
    data: { type: 'new' }
  },
  {
    path: 'document/edit/:id',
    component: DocumentComponent,
    data: { type: 'edit' }
  },
  {
    path: 'document/edit-order',
    component: DocumentComponent,
    data: { type: 'editorder' }
  },
  {
    path: 'document-category',
    component: DocumentCategoryComponent,
    data: { type: 'list' }
  },
  {
    path: 'document-category/new',
    component: DocumentCategoryComponent,
    data: { type: 'new' }
  },
  {
    path: 'document-category/edit/:id',
    component: DocumentCategoryComponent,
    data: { type: 'edit' }
  },
  {
    path: 'video',
    component: VideoComponent,
    data: { type: 'list' }
  },
  {
    path: 'video/new',
    component: VideoComponent,
    data: { type: 'new' }
  },
  {
    path: 'video/edit/:id',
    component: VideoComponent,
    data: { type: 'edit' }
  },
  {
    path: 'video/edit-order',
    component: VideoComponent,
    data: { type: 'editorder' }
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

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const appRoutingModule = RouterModule.forRoot(routes);
