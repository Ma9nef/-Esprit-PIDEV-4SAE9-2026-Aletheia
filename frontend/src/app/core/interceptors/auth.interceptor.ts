import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private allowedHosts = [
    'http://localhost:8080', // user-service
    'http://localhost:8081', // courses
    'http://localhost:8082', // library
    'http://localhost:8086', // offer
    'http://localhost:8089', // API Gateway
    'http://localhost:8090', // events
    'http://localhost:8094'  // resource management
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');

    // Attach token to absolute URLs matching known hosts,
    // AND to all relative /api calls that go through the Angular dev proxy → gateway.
    const isAllowed =
      this.allowedHosts.some(base => req.url.startsWith(base)) ||
      req.url.startsWith('/api');

    if (token && isAllowed) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}
