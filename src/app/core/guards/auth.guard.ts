import { Injectable } from '@angular/core';
// import {CanActivate} from '@angular/router';
import { WebStorageService } from '../services/web-storage.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private WebStorage:WebStorageService,private router:Router){}
  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      state
      // return true;
      if (!this.WebStorage.checkUserIsLoggedIn()) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }

  }

} 

