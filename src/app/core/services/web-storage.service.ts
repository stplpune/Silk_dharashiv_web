import { Injectable } from '@angular/core';
import { AesencryptDecryptService } from './aesencrypt-decrypt.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebStorageService {
  toggled: boolean = false;
  lang: string = 'English';
  data: any;
  private profileInfo=new BehaviorSubject('');

  constructor(private AESEncryptDecryptService: AesencryptDecryptService) { }


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

 // Get LocalStorage Data
  getLoggedInLocalstorageData() {
    if (this.checkUserIsLoggedIn() == true) {
      var decryptData = JSON.parse(this.AESEncryptDecryptService.decrypt(localStorage['loggedInData']));
      let data = decryptData;
      return data;
    }
  }

 // Get All Page Details For Sidebar
  getAllPageName(){
    let data=this.getLoggedInLocalstorageData();
    if (this.checkUserIsLoggedIn() == true) {
      return data.pageList;
    }
  }

  // // Get Selected Page Details Object
  // getPageDetailsObj(pageName:string){
  //   const pageObj = this.getAllPageName()?.find((x:any)=>x.pageLink==pageName)
  //   return pageObj
  // }
  
  redirectTo(){ ////redirect to first page in array
    let data = this.getLoggedInLocalstorageData()
    return data.pageList[0].pageURL;
   }


   
   getUserId() {
    let data = this.getLoggedInLocalstorageData();
    return data.id ? data.id : 0;
  }

  // Get State Id
  getStateId(){
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.stateId > 0 ? data?.stateId : '' : '';
  }

  // Get District Id
   getDistrictId(){
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.districtId > 0 ? data?.districtId : '' : '';
  }


  // change language
  setLanguage = new BehaviorSubject('');


  //testing code lang for common
  language = new BehaviorSubject('');
  setLanguageSubject = this.language.asObservable();

  setLanguageCallback() {
    this.setLanguageSubject.subscribe(() => {
      this.lang = sessionStorage.getItem('language') || 'English';
      this.lang = this.lang === 'English' ? 'en' : 'mr-IN';
    });
    return this.lang
  }

// header profile data patch
  getProfileData() {
    return this.profileInfo.asObservable()  
  }
  
  setProfileData(info: any) {
    this.profileInfo.next(info)
  }


}
