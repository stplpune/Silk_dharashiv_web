import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  baseUrl = environment.baseUrl;

  loginFlag:string = 'web';

  //--------------------------------------------------Api Path url----------------------------------------------------------------//

  dialogBoxWidth = ['320px', '800px', '700px', '1024px'];  // Set angular material dialog box width

  disableCloseBtnFlag: boolean = true// When click on body material dialog box is not closed flag

  pageSize: number = 10; // Angular material data table page size limt

  fill: string | any = 'fill'; // Reactive form fill appearance

  outline: string | any = 'outline'; // Reactive form fill filter appearance

  //------------------------------------------ Maps Settings  starte heare -------------------------------------------//

  lat = 19.0898177;

  long = 76.5240298;

  zoom: number = 8;

  viewType: string = 'roadmap';

  static googleApiObj: object = { // google api key
    // apiKey: 'AIzaSyBhkYI4LMEqVhB6ejq12wpIA6CW5theKJw', //live
    apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8', //demo
    language: 'en',
    libraries: ['drawing', 'places']
  };

  //------------------------------------------ Maps Settings  starte heare -------------------------------------------//

  applicationStatus = [
    { id: 1, textEnglish: "Application Review", textMarathi: "अर्ज स्वीकृती", isImageUpload: false },
    { id: 2, textEnglish: "Village Committee Approval", textMarathi: "ग्रामसभा मंजूरी", isImageUpload: true },
    { id: 3, textEnglish: "Technical Estimate", textMarathi: "अंदाजपत्रक", isImageUpload: true },
    { id: 4, textEnglish: "Technical Santion", textMarathi: "तांत्रिक मान्यता", isImageUpload: true },
    { id: 5, textEnglish: "Administrative Approval", textMarathi: "प्रशासकीय मान्यता", isImageUpload: true },
    { id: 6, textEnglish: "Land Survey(After Plantation)", textMarathi: "स्थळ पाहणी (लागवडी नंतर)", isImageUpload: false },
    { id: 7, textEnglish: "Mulberry Id", textMarathi: "मलबेरी आयडी", isImageUpload: false },
    { id: 8, textEnglish: "Prior Approval", textMarathi: "पूर्व संमती", isImageUpload: false }
  ]

}
