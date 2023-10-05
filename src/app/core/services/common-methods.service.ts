import { Injectable } from '@angular/core';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  constructor(private _SnackBar: MatSnackBar,private datePipe: DatePipe) { }

  snackBar(data: string, status: number) {
    let snackClassArr: any = ['snack-success', 'snack-danger', 'snack-warning'];
    this._SnackBar.open(data, " ", {
      duration: 2000,
      panelClass: [snackClassArr[status]],
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
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

}
