import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  name = '^[a-zA-Z]+$';
  fullName = ('^[a-zA-Z][a-zA-Z ]*$');
  fullNamequetion = ('^[a-zA-Z?][a-zA-Z? !@#$%^&*0-9]*$');
  email = ('^[a-zA-Z0-9][a-zA-Z0-9._-]+[a-zA-Z0-9]+@([a-z.]+[.])+[a-z]{2,5}$');
  mobile_No = ('[6-9]\\d{9}');
  aadhar_card = ('^[2-9][0-9]{11}$');
  password =('^(?=.*[a-z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9\d@$!%*?&#]{8,20}$');
  panNumber = '[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}';
  marathi=('^[\u0900-\u0965 ]+$');
  alphabetWithSpace = '^[a-zA-Z][a-zA-Z ]*$';
  bankIFSCCodeVal = "^[A-Z]{4}0[A-Z0-9]{6}$";
  alphaNumericWithSpace = '^[a-zA-Z0-9 -][a-zA-Z0-9 -]*$';
  alphaNumericWithoutSpace = '^[a-zA-Z0-9-][a-zA-Z0-9-]*$';
  valPinCode = '^[1-9][0-9]{5}$';
  alphabetsWithSpecChar = `^([a-zA-Z0-9 /(,)&.+-=\n'])*$`;
  latValidation ='^[1-9]{1}[0-9]{1}[.]{1}[0-9]{1,8}$';
  longValidation ='^[1-9]{1}[0-9]{1}[.]{1}[0-9]{1,8}$';
  onlyNumbers = '^[0-9]*$';
  marathiNumericAndspecialChar = '[0-9\u0900-\u097F\s]*';
  //marathiNumericAndspecialChar = '/^[\u0900-\u0965?~`!@#$%^&*()\[\]\-+_={}|;:\\<,>.?\/ 0-9]+$/';
  //englishNumericAndspecialChar = '^[a-zA-Z?~`!@#$%^&*()-_+={}[\]:|\\;"<,>.?\/ 0-9]*$';
  englishNumericAndspecialChar = '^[A-Za-z0-9 *%!/(,)&.+-_@#$]*$'
  marathiquestion=('^[\u0900-\u0965? *%!/(,)&.+-_@#$0-9]+$');
  numericWithdecimaluptotwoDigits='^[0-9][0-9]*[.]?[0-9]{0,2}$';
  alphaNumericWithSpacesWithDashSlashs = '^([a-zA-Z0-9/-])';
  marathiAlphanumeric=('^[\u0900-\u09650-9 ][\u0900-\u09650-9 ]+$');
  englishAlphanumeric = '^[a-zA-Z0-9 ][a-zA-Z0-9 ]*$';
  // [Validators.pattern('[a-zA-Z0-9\u0900-\u097F\s]*')]
  marathiAlphaNumeric(event: any) {
    const maskSeperator = new RegExp('^[\u0900-\u09650-9 ]+$', 'g');
    return maskSeperator.test(event.key);
  }

  englishAlphaNumeric(event: any) {
    const maskSeperator = new RegExp('^[a-zA-Z0-9 ]+$', 'g');
    return maskSeperator.test(event.key);
  }

  marathiNumericspecialChar(event: any) {
    const maskSeperator = new RegExp('^[\u0900-\u0965?~`!@#$%^&*()\\-+_={}\\[\\]:|;\\\\<,>.?/ 0-9]+$', 'g');
    return maskSeperator.test(event.key);
  }
  

  englishNumericspecialChar(event: any) {
    const regexPattern = new RegExp('^[A-Za-z0-9 *%!/(,)&.+-_@#$]*$','g');
    return regexPattern.test(event);
  }
  

  MarathiCharacterValidator(){
    return (control: AbstractControl): { [key: string]: any } | null => {
      const marathiRegex = /^[,./_\u0900-\u097F\s]+$/; // Regular expression for Marathi characters and space
  
      if (control.value && !marathiRegex.test(control.value)) {
        return { marathiCharacters: true };
      }
      
      return null;
    };
  }
  
  
  maxLengthValidator(maxLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.length > maxLength) {
        return { maxLengthExceeded: true };
      }
      return null;
    };
  }

  minLengthValidator(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.length < minLength) {
        return { minLengthNotMet: true };
      }
      return null;
    };
  }

  alphaNumericWithSpacesAndSpecCharss(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 -])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithSpacesWithDashSlash(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9/-])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithQuetion(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 ?!@#$%^&*0-9])', 'g');
    return maskSeperator.test(event.key);
  }

  alphabetsWithSpaces(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z ])', 'g');
    return maskSeperator.test(event.key);
  }

  alphabetsMarathiWithSpaces(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z\u0900-\u0965 ])', 'g');
    return maskSeperator.test(event.key);
  }

  // latitude_longitude(event: any) {
  //   const maskSeperator = new RegExp('^([1-9]{1}[0-9]{1}[.]{1}[0-9]{1,8}$)', 'g');
  //   return maskSeperator.test(event.key);
  // }

  onlyAlphabetsWithSpace(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z])', 'g');
    return maskSeperator.test(event.key);
  }
  noSpacesAtStart(event: any) {
    const maskSeperator = new RegExp('^[ ]+|[ ]+$', 'm');
    return !maskSeperator.test(event.key);
  }

  onlyDigits(event: any) {
    const maskSeperator = new RegExp('^([0-9])', 'g');
    return maskSeperator.test(event.key);
  }
  // /^-?(0|[1-9]\d*)?$/
  digitsWithDot(event: any) {
    const maskSeperator = new RegExp('^([0-9 .])', 'g');
    return maskSeperator.test(event.key);
  }
  onlyAlphabets(event: any) {
    if (!this.noSpacesAtStart(event)) {
      return false
    }
    const maskSeperator = new RegExp('^([a-zA-Z])', 'g');
    return maskSeperator.test(event.key);
  }

  removeSpaceAtBegining(event: any) {
    let temp = true;
    try {
      if (!event.target.value[0].trim()) {
        event.target.value = event.target.value.substring(1).trim();
        temp = false;
      }
    }
    catch (e) {
      temp = false;
    }
    return temp
  }

  unicodeMarathiValidation(event: any) {
    const maskSeperator = new RegExp('[^\u0900-\u0965 ]+', 'm');
    return !maskSeperator.test(event.key);
  }

  unicodeMarathiQuetionValidation(event: any) {
    const maskSeperator = new RegExp('[^\u0900-\u0965? *%!/(,)&.+-_@#$0-9]+', 'm');
    return !maskSeperator.test(event.key);
  }
  emailRegex(event: any) { //Email Validation
    if (!this.noSpacesAtStart(event)) return false; // First Space not Accept
    if (event.currentTarget.value.split('..').length - 1 == 1 && (event.keyCode == 46)) return false;  // double .Dot not accept
    if (event.currentTarget.value.split('@').length - 1 == 1 && (event.keyCode == 64)) return false;  // double @ not accept
    if (event.target.selectionStart === 0 && (event.keyCode == 46)) return false;  // starting .Dot not accept
    if (event.target.selectionStart === 0 && (event.keyCode == 64)) return false;  // starting @ not accept
    const maskSeperator = new RegExp('^([a-zA-Z0-9 .@_-])', 'g'); // only Accept A-Z & 0-9 & .@
    return maskSeperator.test(event.key);
  }

  alphaNumeric(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9])', 'g');
    return maskSeperator.test(event.key);
  }
  
  noFirstSpaceAllow(event: any) {  // for First Space Not Allow
    if (event.target.selectionStart === 0 && (event.code === 'Space')) {
      event.preventDefault();
    }
  }
  alphaNumericWithSpaces(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 ])', 'g');
    return maskSeperator.test(event.key);
  }
  
  alphaNumericWithSpacesAndSpecChars(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 (,)+-@#$])', 'g');
    return maskSeperator.test(event.key);
  }
  
  noSpaceAllow(event: any) {  // for All Space Not Allow
    if (event.code === 'Space') {
        event.preventDefault();
    }
}

  acceptedOnlyNumbers(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  alphaNumericWithSpacesAndSpecChar(event: any) {      // Address
    const maskSeperator = new RegExp('^([a-zA-Z0-9 ,/-])', 'g');
    return maskSeperator.test(event.key);
  }

  isValidPanCardNo(event: any) {
   const maskSeperator = new RegExp('^([A-Z0-9])', 'g');
    return maskSeperator.test(event.key);
  }

}
