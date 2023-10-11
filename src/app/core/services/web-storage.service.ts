import { Injectable } from '@angular/core';
import { AesencryptDecryptService } from './aesencrypt-decrypt.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {
  toggled: boolean = false;
  lang: string = 'English';

  constructor(private AESEncryptDecryptService:AesencryptDecryptService) { }


  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  checkUserIsLoggedIn() {
    if (localStorage.getItem('loggedInData'))
      return true
    else return false
  }

  getLoggedInLocalstorageData() {
    if (this.checkUserIsLoggedIn() == true) {
      var decryptData = JSON.parse(this.AESEncryptDecryptService.decrypt(localStorage['loggedInData']));
      let data = decryptData;
      return data;
    }
  }

  getUserId(){
    let data = this.getLoggedInLocalstorageData();
    return data.id ? data.id : 0;
  }

  // change language
  setLanguage = new BehaviorSubject('');

  
  //testing code lang for common
  language = new BehaviorSubject('');
  setLanguageSubject  = this.language.asObservable();

setLanguageCallback() {
  this.setLanguageSubject.subscribe(() => {
    this.lang = sessionStorage.getItem('language') || 'English';
    this.lang = this.lang === 'English' ? 'en' : 'mr-IN';
  });
  return this.lang
}


}
