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
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users/new',
    component: UsersComponent
  },

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const appRoutingModule = RouterModule.forRoot(routes);
