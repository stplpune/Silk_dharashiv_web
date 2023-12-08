import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent {
  profileForm !: FormGroup;
  pageAccessObject: object | any;
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  profilDetailsArr: any;
  imageRes: any;
  editFlag: boolean = false;
  @ViewChild('uploadDocument') clearlogo!: any;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    private errorHandler: ErrorHandlingService,
    private WebStorageService: WebStorageService,
    private fileUpl: FileUploadService,
    private fb: FormBuilder,
    public validator: ValidationService,
    private encrypt: AesencryptDecryptService
  ) { }

  ngOnInit() {
    this.WebStorageService.getAllPageName().filter((ele: any) => { return ele.pageName == 'Department' ? this.pageAccessObject = ele : '' })
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getssProfileData();
    this.formData();
  }

  get f() { return this.profileForm.controls }

  formData() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(this.validator.fullName), this.validator.maxLengthValidator(50)]],
      m_Name: ['', [Validators.required, Validators.pattern(this.validator.marathi), this.validator.maxLengthValidator(50)]],
      mobileNo: [''],
      address: ['', [this.validator.maxLengthValidator(100)]]
    })
  }

  getssProfileData() {
    this.apiService.setHttp('get', `sericulture/api/UserRegistration/get-user-details?Id=${this.WebStorageService.getUserId()}&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.profilDetailsArr = res.responseData.responseData1[0];
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorHandler.handelError(err.statusCode) })
    });
  }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc', '', '', this.lang).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.imageRes = res.responseData;
        }
        else {
          this.imageRes = "";
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  deleteImage(){
    this.clearlogo.nativeElement.value="";
    this.imageRes="";
  }

  onEditProfile() {
    this.editFlag = true;
    this.f['name'].setValue(this.profilDetailsArr.name);
    this.f['m_Name'].setValue(this.profilDetailsArr.m_Name);
    this.f['mobileNo'].setValue(this.profilDetailsArr.mobNo1);
    this.f['address'].setValue(this.profilDetailsArr.address);
  }

  onSubmit() {
    let formvalue = this.profileForm.getRawValue();
    let obj = {
      "id": this.profilDetailsArr.id,
      "crcName": this.profilDetailsArr.crcName,
      "m_CRCName": this.profilDetailsArr.m_CRCName,
      "blockId": this.profilDetailsArr.blockId,
      "circleId": this.profilDetailsArr.circleId,
      "designationId": this.profilDetailsArr.designationId,
      "departmentId": this.profilDetailsArr.departmentId,
      "departmentLevelId": this.profilDetailsArr.departmentLevelId,
      "name": formvalue.name,
      "m_Name": formvalue.m_Name,
      "crcRegNo": this.profilDetailsArr.crcRegNo,
      "aadharNumber": this.profilDetailsArr.aadharNumber,
      "gender": 0,
      "dob": null,
      "mobNo1": this.profilDetailsArr.mobNo1,
      "mobNo2": this.profilDetailsArr.mobNo2,
      "emailId": this.profilDetailsArr.emailId,
      "userName": this.profilDetailsArr.userName,
      "password": "string",
      "stateId": this.profilDetailsArr.stateId,
      "districtId": this.profilDetailsArr.districtId,
      "talukaId": this.profilDetailsArr.talukaId,
      "grampanchayatId": this.profilDetailsArr.grampanchayatId,
      "village": "string",
      "address": formvalue.address,
      "m_Address": this.profilDetailsArr.m_Address,
      "pinCode": this.profilDetailsArr.pinCode,
      "totalAreaForCRC": 0,
      "areaUnderCRC": 0,
      "chalkyCapacity": 0,
      "officerAssignArea": this.profilDetailsArr.officerAssignArea,
      "chalkyApprovedQty": 0,
      "doj": "2023-10-27T06:04:55.417Z",
      "profileImagePath": this.imageRes ? this.imageRes : this.profilDetailsArr.profileImagePath,
      "userTypeId": 1, // Farmer Registration
      "createdBy": this.WebStorageService.getUserId(),
      "flag": 'u'
    }
    if (this.profileForm.invalid) {
      return
    } else {
      let setHeaderDataObj = { name: formvalue.name, profile: this.imageRes ? this.imageRes : obj.profileImagePath };
      this.spinner.show();
      this.apiService.setHttp('POST', 'sericulture/api/UserRegistration/insert-update-user-details?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.getssProfileData();
            this.WebStorageService.setProfileData(setHeaderDataObj);
            this.editFlag = false;
            this.changeLocelStorage();
          } else {
            this.spinner.hide();
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (() => { this.spinner.hide(); })
      })
    }
  }

  changeLocelStorage() {
    let encryptInfo;
    this.WebStorageService.getProfileData().subscribe((res: any) => {
      let localData = this.WebStorageService.getLocalstorageData();
      localData.responseData.name = res.name;
      localData.responseData.profileImagePath = res.profile
      encryptInfo = this.encrypt.encrypt(JSON.stringify(localData));
      localStorage.setItem('silkDharashivUserInfo', encryptInfo);
    })
  }
}
