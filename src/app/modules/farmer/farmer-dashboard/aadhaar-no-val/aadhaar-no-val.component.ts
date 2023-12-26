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
import { ApiService } from 'src/app/core/services/api.service';

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
  res: any;
  selectedTab!: number;
  activeTab!: number;

  constructor(public validation: ValidationService, public dialogRef: MatDialogRef<AadhaarNoValComponent>,
    private encryptdecrypt: AesencryptDecryptService, private masterService: MasterService, private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public webStorage: WebStorageService, private commonMethodsService: CommonMethodsService) {
    this.selectedTab = data?.schemeId;
    this.activeTab = data?.schemeId - 1;
    this.getSchemeData();
  }

  aadhaarNo = new FormControl('', [Validators.required, this.validation.maxLengthValidator(12), Validators.pattern(this.validation.aadhar_card)]);

  getSchemeData() {
    this.masterService.GetSelectSchemeData(this.webStorage.getMobileNo(), this.selectedTab).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.res = res;
          if (this.res?.responseData == 4) {
            this.commonMethodsService.snackBar(this.activeTab == 0 ? 'सिल्क समग्र अर्ज प्रक्रियेत आहे...' : 'मग्नरेगा अर्ज प्रक्रियेत आहे...', 1)
          }
        }
        else {
          this.res = '';
        }
      })
    })
  }

  trackApp(schemeId: any) {
    if (schemeId == 3) {
      let Id = this.encryptdecrypt.encrypt(`${this.res.responseData1}` + '.' + '0' + '.' + `${(this.selectedTab) == 1 ? 'm' : 's'}`);
      this.router.navigate([(this.selectedTab) == 1 ? '../approval-process-manarega' : '../approval-process-silk-samgra'], {
        queryParams: {
          id: Id
        },
      });
    } else {
      let url = (this.selectedTab) == 1 ? 'create-manarega-app' : 'create-samgra-app';
      let Id: any = this.encryptdecrypt.encrypt(`${this.aadhaarNo.getRawValue()}`);
      this.router.navigate([url], {
        queryParams: {
          id: Id
        },
      });
    }
    this.onNoClick();
  }

  checkAadharNo() {
    this.apiService.setHttp('GET', 'sericulture/api/Application/Get-Aadhar-No-Validation?AadharNo=' + this.aadhaarNo.getRawValue(), false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.responseData) {
          this.commonMethodsService.snackBar('हा आधार क्रमांक आधीपासून अर्जांसाठी वापरला गेला आहे...', 1)
          return
        }
        let url = (this.selectedTab) == 1 ? 'create-manarega-app' : 'create-samgra-app';
        let Id: any = this.encryptdecrypt.encrypt(`${this.aadhaarNo.getRawValue()}`);
        if (this.res?.responseData == 2 || this.res?.responseData == 1) { // 1.Application not done  2.Application Resend/Incomplete
          this.router.navigate([url], {
            queryParams: {
              id: Id
            },
          });
          this.onNoClick();
        }
        this.onNoClick();
      },
      error: () => { }
    })
  }

  valAadhaarNo() {
    if (!this.checkBoxValueMang) {
      this.commonMethodsService.snackBar('कृपया चेकबॉक्स निवडा', 1);
      return
    } else if (!this.aadhaarNo.getRawValue()) {
      this.commonMethodsService.snackBar('कृपया आधार क्रमांक टाका.', 1);
      return
    } else if (this.aadhaarNo.status != 'VALID') {
      this.commonMethodsService.snackBar('कृपया वैध आधार क्रमांक प्रविष्ट करा', 1);
      return
    }

    this.checkAadharNo();

  }

  selCheckBox(event: any) {
    this.checkBoxValueMang = event.checked;
  }

  onTabChanged(event: any) {
    this.selectedTab = event.index + 1;
    this.activeTab = event.index;
    this.checkBoxValueMang = false;
    this.aadhaarNo.setValue('');
    this.aadhaarNo.markAsUntouched();
    this.getSchemeData();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
