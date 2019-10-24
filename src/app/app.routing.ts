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
    component: AudioComponent
  },
  {
    path: 'audio/new',
    component: AudioComponent
  },
  {
    path: 'document',
    component: DocumentComponent
  },
  {
    path: 'document/new',
    component: DocumentComponent
  },
  {
    path: 'video',
    component: VideoComponent
  },
  {
    path: 'video/new',
    component: VideoComponent
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
