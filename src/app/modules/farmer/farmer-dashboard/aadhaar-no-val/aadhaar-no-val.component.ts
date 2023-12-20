import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-aadhaar-no-val',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, ReactiveFormsModule, TranslateModule, MatCheckboxModule],
  templateUrl: './aadhaar-no-val.component.html',
  styleUrls: ['./aadhaar-no-val.component.scss']
})
export class AadhaarNoValComponent {
  checkBoxValueMang!: boolean;
  setSchTypeId!: number;
  res: any;
  selectedTab: any;

  constructor(private validation: ValidationService, public dialogRef: MatDialogRef<AadhaarNoValComponent>, private encryptdecrypt: AesencryptDecryptService, private masterService: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public webStorage: WebStorageService, private commonMethodsService: CommonMethodsService) { 
      this.selectedTab = data - 1;
    }

  aadhaarNo = new FormControl('', [Validators.required, this.validation.maxLengthValidator(12), Validators.pattern(this.validation.aadhar_card)]);


  valAadhaarNo() {
    if (!this.checkBoxValueMang) {
      this.commonMethodsService.snackBar('Please select checkbox', 1);
      return
    } else if (this.aadhaarNo.status != 'VALID') {
      this.commonMethodsService.snackBar('Please enter valid Aadhaar No', 1);
      return
    }

    this.getSchemeData();

  }

  getSchemeData() {
    this.masterService.GetSelectSchemeData(this.webStorage.getMobileNo(), 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.res = res.responseData;
          let schId = this.setSchTypeId;
          let url = schId == 1 ? 'create-manarega-app' : 'create-samgra-app';
          let Id: any = this.encryptdecrypt.encrypt(`${this.aadhaarNo.getRawValue()}`);

          if (this.res == 2 || this.res == 1) { // 1.Application not done  2.Application Resend/Incomplete
            this.router.navigate([url], {
              queryParams: {
                id: Id
              },
            });
          } else if (this.res == 3) {//Application Complete
            this.router.navigate([url], {
              queryParams: {
                id: Id
              },
            });
          }
          this.onNoClick();
        }
        else {
          this.res = [];
        }
      })
    })
  }

  selCheckBox(event: any, schTypeId: number) {
    this.setSchTypeId = schTypeId;
    this.checkBoxValueMang = event.checked
  }

  onTabChanged() {
    this.checkBoxValueMang = false;
    this.aadhaarNo.setValue('');
    this.aadhaarNo.markAsUntouched();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
