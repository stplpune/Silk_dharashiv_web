import { Injectable } from '@angular/core';
import  *  as CryptoJS from  'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class AesencryptDecryptService {
  secretKey = "8080808080808080";
  constructor() { }
  // encrypt(value : string) : string{
  //   return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  // }

  // decrypt(value : string){
  //   return CryptoJS.AES.decrypt(value, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  // }

  encrypt(data: any) {
    let _key = CryptoJS.enc.Utf8.parse(this.secretKey).toString(CryptoJS.enc.Utf8);
    let _iv = CryptoJS.enc.Utf8.parse(this.secretKey);
    let encrypted = CryptoJS.AES.encrypt(
      data, _key, {
      keySize: 256 / 8,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decrypt(data: any) {
    let _key = CryptoJS.enc.Utf8.parse(this.secretKey).toString(CryptoJS.enc.Utf8);
    let _iv = CryptoJS.enc.Utf8.parse(this.secretKey);
    return CryptoJS.AES.decrypt(
      data, _key, {
      keySize: 256 / 8,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }
}
