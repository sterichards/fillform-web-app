import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User, Role } from './_models';

@Component(
  {
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.css']
  })
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    get isAdmin() {
        return this.currentUser && this.currentUser.role === Role.Admin;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

  hasRole(role) {
    const userRoles = JSON.parse(localStorage.getItem('roles'));
    let hasRole = false;

    userRoles.forEach(userRole => {
      if (userRole === role) {
        hasRole = true;
      }
    });

    return hasRole;
  }
}
