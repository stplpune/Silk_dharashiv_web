import { Injectable } from '@angular/core';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {
  codecareerPage: any;
  constructor(private _SnackBar: MatSnackBar, private datePipe: DatePipe,
    private router: Router, public location: Location,
    private activatedRoute: ActivatedRoute,) { }

  snackBar(data: string, status: number) {
    let snackClassArr: any = ['snack-success', 'snack-danger', 'snack-warning'];
    this._SnackBar.open(data, " ", {
      duration: 2000,
      panelClass: [snackClassArr[status]],
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }

  locationBack() {
    this.location.back();
  }


  checkDataType(val: any) {
    let value: any;
    if (val == "" || val == null || val == "null" || val == undefined || val == "undefined" || val == 'string' || val == 0) {
      value = false;
    } else {
      value = true;
    }
    return value;
  }



  // date format in toISOstring 
  setDate(date: any) {
    if (date) {
      let d = new Date(date);
      d.setHours(d.getHours() + 5);
      d.setMinutes(d.getMinutes() + 30);
      return d.toISOString();
    }
    else {
      return "";
    }
  }

  // date format dd/mm/yyyy 
  dateFormat(date: any) {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  // captcha
  createCaptchaCarrerPage() {
    let id: any = document.getElementById('captcha');
    id.innerHTML = "";
    // "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    var charsArray = "0123456789";
    var lengthOtp = 4;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      var index = Math.floor(Math.random() * charsArray.length + 0);
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha1";
    canv.width = 120;
    canv.height = 28;
    var ctx: any = canv.getContext("2d");
    ctx.font = "26px Arial";
    ctx.fillText(captcha.join(""), 40, 28);
    this.codecareerPage = captcha.join("");
    let appendChild: any = document.getElementById("captcha");
    appendChild.appendChild(canv);

  }

  checkvalidateCaptcha() {
    return this.codecareerPage;
  }

  routerLinkRedirect(path: any) {
    this.router.navigate([path], { relativeTo: this.activatedRoute })
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    translate: 'no',
    outline: false,
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [
      ['insertVideo', 'toggleEditorMode', 'heading']
    ],
    // customClasses: [
    //   {
    //     name: 'image',
    //     class: 'textareaimage',
    //     tag: 'img',
    //   },
    // ],
  };

  findIndexOfArrayObject(array: any, key: any, val: any) { // find index of array object  [{'id:0',:name:'john'}, {'id:1',:name:'deo'}]
    let index = array.findIndex((x: any) => x[key] === val);
    return index
  }

  //.......................... filter ngx-mat-select-search dropdown common code Start Here...........................//
  filterArrayDataZone(array: any, formControl: any, keyName: any, subjectName: any) {
    if (!array) { return; }
    let search = formControl.value;
    if (!search) {
      subjectName.next(array.slice());
      return;
    } else { search = search.toLowerCase(); }

    subjectName.next(array.filter( // filter the array data
      (ele: any) => ele[keyName]?.toLowerCase().indexOf(search) > -1));
  }
  //.......................... filter ngx-mat-select-search dropdown common code End Here...........................//

}
