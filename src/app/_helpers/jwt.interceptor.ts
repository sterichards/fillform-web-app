import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '@environments/environment';
import {AuthenticationService} from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url

    const currentUser = this.authenticationService.currentUserValue;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const token = localStorage.getItem('token');
    const isLoggedIn = currentUser && token;

    if (isLoggedIn && isApiUrl) {

      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return next.handle(request);
  }
}
