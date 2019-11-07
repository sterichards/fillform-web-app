import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {User} from '@app/_models';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {

    const loginObj = {
      username: username,
      password: password,
      grant_type: 'password',
      client_secret: '5rhkgaacbu8s4gosks8os0swocg00kso4oc8scww0404gw0wcg8',
      client_id: '1_5063jshe0pcsosssosggsgc4s884so44c0k0kwwswoccs00k08'
    }

    return this.http.post<any>(`${environment.apiUrl}/oauth/v2/token`, loginObj)
      .pipe(map(response => {

        // login successful if there's a jwt token in the response
        if (response && response.access_token) {

          let roles = [];

          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.access_token);

          response.user.roles.forEach(role => {
            roles.push(role.role);
          });

          console.log(JSON.stringify(roles));
          localStorage.setItem('roles', JSON.stringify(roles));
          this.currentUserSubject.next(response);
        }

        return response;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
