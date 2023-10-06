import { Injectable } from '@angular/core';
// import {CanActivate} from '@angular/router';
import { WebStorageService } from '../services/web-storage.service';
import { CommonMethodsService } from '../services/common-methods.service';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private WebStorage:WebStorageService,private commonMethod:CommonMethodsService){}
  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      state
      // return true;
      if (!this.WebStorage.checkUserIsLoggedIn()) {
        this.commonMethod.routerLinkRedirect('/login');
        return false
      } else {
        return true;
      }

  }

} 

