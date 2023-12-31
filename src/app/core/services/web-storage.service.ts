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
  private profileInfo = new BehaviorSubject('');

  breadCrumbArray:any = new BehaviorSubject('');
  breadCrumbLabel:any = new BehaviorSubject('');

  verifyOtpFlag : boolean = false;

  constructor(private AESEncryptDecryptService: AesencryptDecryptService) { }

  getVerifyOtp(){
    return this.verifyOtpFlag 
  }
  
  setVerifyOtp(value: boolean) {
    this.verifyOtpFlag = value;
  }

  getSidebarState() {
    return this.toggled;
  }

  setSidebarState(state: boolean) {
    this.toggled = state;
  }

  checkUserIsLoggedIn() {
    if (localStorage.getItem('silkDharashivUserInfo')){
      return true
    }else{
      return false
    }
  }

  getLocalstorageData() {
    if (this.checkUserIsLoggedIn()) {
      var decryptData =JSON.parse(this.AESEncryptDecryptService.decrypt(localStorage['silkDharashivUserInfo']));
      let data = decryptData;
      return data;
    }
  }

  // Get LocalStorage Data
  getLoggedInLocalstorageData() {
    if (this.checkUserIsLoggedIn()) {
      var decryptData =JSON.parse(this.AESEncryptDecryptService.decrypt(localStorage['silkDharashivUserInfo']));
      let data = decryptData?.responseData;
      return data;
    }
  }

  getJWTTokenData() {
    if (this.checkUserIsLoggedIn()) {
      var decryptData = JSON.parse(this.AESEncryptDecryptService.decrypt(localStorage['silkDharashivUserInfo']));
      let data = decryptData?.responseData1
      return data;
    }
  }

  // Get All Page Details For Sidebar
  getAllPageName() {
    let data = this.getLoggedInLocalstorageData();
    if (this.checkUserIsLoggedIn()) {
      return data.pageList;
    }
  }

  // // Get Selected Page Details Object
  // getPageDetailsObj(pageName:string){
  //   const pageObj = this.getAllPageName()?.find((x:any)=>x.pageLink==pageName)
  //   return pageObj
  // }

  redirectTo() { ////redirect to first page in array
    let data = this.getLoggedInLocalstorageData();
    return  data.pageList[0]?.pageURL;
  }

  getUserId() {
    let data = this.getLoggedInLocalstorageData();
    return data.id ? data.id : 0;
  }

  getMobileNo() {
    let data = this.getLoggedInLocalstorageData();
    return data.mobileNo1 ? data.mobileNo1 : 0;
  }

  getTypeId() {
    let data = this.getLoggedInLocalstorageData();
    return data.userTypeId ? data.userTypeId : 0;
  }


  getStateId() { // Get Login State Id
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.stateId > 0 ? data?.stateId : '' : '';
  }

  getDistrictId() { // Get Login District Id
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.districtId > 0 ? data?.districtId : '' : '';
  }

  getTalukaId() {  // Get Login  Taluka Id
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.talukaId > 0 ? data?.talukaId : '' : '';
  }

  getCircleId() { // Get Login Circle Id
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.circleId > 0 ? data?.circleId : '' : '';
  }

  getBlockId() { // Get Login Block Id
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.blockId > 0 ? data?.blockId : '' : '';
  }

  getGrampanchayatId() { // Get Login Grampanchayat Id
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.grampanchayatId > 0 ? data?.grampanchayatId : '' : '';
  }

  getDesignationId() {   //Get Login Designation Id
    let data = this.getLoggedInLocalstorageData();
    return data ? data?.designationId > 0 ? data?.designationId : '' : '';
  }

  // change language
  setLanguage:any = new BehaviorSubject('');

  // header profile data patch
  getProfileData() {
    return this.profileInfo.asObservable()
  }

  setProfileData(info: any) {
    this.profileInfo.next(info)
  }
}
