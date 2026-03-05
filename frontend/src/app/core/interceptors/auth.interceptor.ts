import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private allowedHosts = [
    'http://localhost:8080',
    'http://localhost:8081'
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');

    const isAllowed = this.allowedHosts.some(base => req.url.startsWith(base));

    if (token && isAllowed) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}