import { Component } from '@angular/core';
import { MasterService } from 'src/app/core/services/master.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OtpSendReceiveComponent } from 'src/app/shared/components/otp-send-receive/otp-send-receive.component';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-farmersignup',
  templateUrl: './farmersignup.component.html',
  styleUrls: ['./farmersignup.component.scss']
})
export class FarmersignupComponent {

  signUpForm !: FormGroup;
  districtArray = new Array();
  talukaArray = new Array();
  villageArray = new Array();
  grampanchayatArray = new Array();
  subscription!: Subscription;
  lang: any;

  constructor(
    private master: MasterService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public validator: ValidationService,
    private apiService: ApiService,
    private commonMethods: CommonMethodsService,
    private error: ErrorHandlingService,
    private WebStorageService: WebStorageService,
    private router: Router, 
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.formData();
    this.getDisrict();
  }

  formData() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.validator.fullName)]],
      mobileNo: ['', [Validators.required, Validators.pattern(this.validator.mobile_No)]],
      districtId: [1, [Validators.required]],
      talukaId: ['', [Validators.required]],
      grampanchayatId: ['', [Validators.required]],
      village: ['', [Validators.required, Validators.pattern(this.validator.fullName)]]
    })
  }

  get f() { return this.signUpForm.controls }

  getDisrict() {
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.getTaluka();
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  getTaluka() {
    let distId = this.signUpForm.getRawValue().districtId;
    this.master.GetAllTaluka(1, distId, 0).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
      }), error: (() => {
        this.talukaArray = [];
      })
    })
  }

  getGrampanchayat() {
    let talId = this.signUpForm.getRawValue().talukaId;
    this.master.GetGrampanchayat(talId).subscribe({
      next: ((res: any) => {
        this.grampanchayatArray = res.responseData;
      }), error: (() => {
        this.grampanchayatArray = [];
      })
    })
  }

  openSendOtpComponent() {
    if (this.signUpForm.invalid) {
      return;
    } else {
      let dialogObj = {
        header: this.lang == "en" ? "Sign Up OTP" : "ओटीपी साइन अप करा",
        button: this.lang == "en" ? "Verify OTP" : "ओटीपी सत्यापित करा",
        pageName: "farmer-signUp",
        mobileNo: this.signUpForm.getRawValue().mobileNo,
        createdBy:0
      };
      const dialogRef = this.dialog.open(OtpSendReceiveComponent, {
        width: '30%',
        data: dialogObj,
        disableClose: true,
        autoFocus: true,
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result == 'Yes') {
          this.saveSignUpData();
        }
      });
    }
  }

  saveSignUpData() {
    this.spinner.show();
    let formValue = this.signUpForm.getRawValue()
    let obj = {
      "id": 0,
      "crcName": "",
      "m_CRCName": "",
      "stateId": 1,
      "districtId": formValue.districtId,
      "blockId": 0,
      "circleId": 0,
      "designationId": 2, // 2 is Farmer
      "departmentId": 0,
      "departmentLevelId": 0,
      "m_Name": "",
      "crcRegNo": "",
      "aadharNumber": "",
      "gender": 0,
      "dob": null,
      "mobNo2": "",
      "emailId": "",
      "userName": "",
      "password": "",
      "address": "",
      "m_Address": "",
      "pinCode": "",
      "totalAreaForCRC": 0,
      "areaUnderCRC": 0,
      "chalkyCapacity": 0,
      "officerAssignArea": "",
      "chalkyApprovedQty": 0,
      "doj":null,
      "profileImagePath": "",
      "userTypeId": 1,
      "createdBy": 0,
      "flag": "i"
    }

    let postObj = {obj, ...formValue};

    this.apiService.setHttp('post', 'sericulture/api/UserRegistration/insert-update-user-details?lan=' + this.lang, false, postObj, false, 'masterUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.spinner.hide();
        this.commonMethods.snackBar(res.statusMessage, 0);
        this.router.navigate(['/login']);
      }
      else {
        this.spinner.hide();
        this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.spinner.hide();
      this.error.handelError(error.status);
    })
  }

  clearDependancy() {
    this.f['grampanchayatId'].setValue('');
    this.grampanchayatArray = [];
  }
}


