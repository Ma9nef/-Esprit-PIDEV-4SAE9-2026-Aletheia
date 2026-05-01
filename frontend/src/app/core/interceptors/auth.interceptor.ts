import { Injectable } from '@angular/core';

import {

  HttpInterceptor,

  HttpRequest,

  HttpHandler

} from '@angular/common/http';



@Injectable()

export class AuthInterceptor implements HttpInterceptor {



  private allowedHosts = [

    'http://localhost:18080', // user-service (Docker hôte) si accès direct

    'http://localhost:8089', // API Gateway

    'http://localhost:8081', // courses

    'http://localhost:8082', // library

    'http://localhost:8086', // offer

    'http://localhost:8090', // events

    'http://localhost:8094'  // resource management

  ];



  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const raw =
      localStorage.getItem('token') ??
      localStorage.getItem('accessToken') ??
      localStorage.getItem('jwt');
    const token = raw?.trim();

    if (!token) {

      return next.handle(req);

    }



    const isBackendApi =

      this.resolvePathname(req.url).startsWith('/api') ||

      this.allowedHosts.some((base) => req.url.startsWith(base));



    if (!isBackendApi) {

      return next.handle(req);

    }



    return next.handle(

      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'X-Auth-Token': token
        }
      })

    );

  }



  /**

   * Normalize request URL to a pathname so we attach JWT for `/api/**`

   * whether Angular passes `/api/...`, `api/...`, or full same-origin URLs.

   */

  private resolvePathname(url: string): string {

    try {

      if (/^https?:\/\//i.test(url)) {

        return new URL(url).pathname || '';

      }

      const origin =

        typeof window !== 'undefined' && window.location?.origin

          ? window.location.origin

          : 'http://localhost';

      const path = url.startsWith('/') ? url : `/${url}`;

      return new URL(path, origin).pathname;

    } catch {

      const raw = url.split('?')[0];

      return raw.startsWith('/') ? raw : `/${raw}`;

    }

  }

}


