import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import {MatDialogModule} from '@angular/material/dialog';


@Component({
  selector: 'app-global-dialog',
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss'],
  standalone: true,
  imports: [ CommonModule,MatButtonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,MatDialogModule]
})
export class GlobalDialogComponent {
  remark:any = new FormControl('');
  constructor(public dialogRef: MatDialogRef<GlobalDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,    public commonService: CommonMethodsService, public valiService: ValidationService) { }

  ngOnInit() {
    console.log("data",this.data);
    console.log("this data ",this.data);
    

  }

  closeDialog(flag: string) {
    if (this.data.discription && flag == "Yes") {
      // if (this.remark.value.trim() == "") {
      //   this.commonService.snackBar("Please Enter Remark", 1);
      //   return
      // } else {
        let obj = {
          flag: flag,
          // inputValue: this.remark.value
          inputValue: this.remark.value.trim()
        }
        this.dialogRef.close(obj)
      // }
    } else {
      this.dialogRef.close(flag);
    }
  }

}
