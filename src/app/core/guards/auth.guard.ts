import { Injectable } from '@angular/core';
// import {CanActivate} from '@angular/router';
import { WebStorageService } from '../services/web-storage.service';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private WebStorage:WebStorageService,private router:Router){}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    
    if (!this.WebStorage.checkUserIsLoggedIn()) {
      this.router.navigate(['/login']);
      return false
    } else {
      return true;
    }
}

} 

