import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-officer',
  templateUrl: './register-officer.component.html',
  styleUrls: ['./register-officer.component.scss']
})
export class RegisterOfficerComponent {
  officeForm!: FormGroup
  viewFlag: boolean = false;
  departmentArray = new Array();
  departmentLevelArray = new Array();
  stateArray = new Array();
  districtArray = new Array();
  blockArray = new Array();
  talukaArray = new Array();
  circleArray = new Array();
  grampanchayatArray = new Array();
  designationArray = new Array();
  tableDataArray = new Array();
  showFlag: boolean = false;
  statusForm!: FormGroup;
  imageResponse: string = '';
  subscription!: Subscription;
  lang: string = 'English';
  @ViewChild('formDirective') private formDirective!: NgForm;
  @ViewChild('uplodLogo') clearlogo!: any;
  statusArray = [{ id: 0, 'value': 'De Active', 'mr_value': 'निष्क्रिय' }, { id: 1, 'value': 'Active', 'mr_value': 'सक्रिय' }];

  constructor
    (
      private fb: FormBuilder,
      private masterService: MasterService,
      private errorHandler: ErrorHandlingService,
      private commonMethod: CommonMethodsService,
      private dialogRef: MatDialogRef<RegisterOfficerComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
      private spinner: NgxSpinnerService,
      private WebStorageService: WebStorageService,
      private apiService: ApiService,
      public validator: ValidationService,
      private fileUpl: FileUploadService,
      private webService: WebStorageService
    ) { }


  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getFormData();
    this.getstatusForm();
    this.data?.label == 'View' ? (this.viewFlag = true, this.getDataById()) : (this.viewFlag = false, this.getDepartment(), this.getDepartmentLevel());
  }


  getFormData() {
    if (this.data) {
      this.data.blockId = this.data?.blockId != 0 ? this.data?.blockId : ''
      this.data.talId = this.data?.talId != 0 ? this.data?.talId : ''
      this.data.circleId = this.data?.circleId != 0 ? this.data?.circleId : ''
      this.data.grampanchayatId = this.data?.grampanchayatId != 0 ? this.data?.grampanchayatId : ''
      this.data.designationId = this.data?.designationId != 0 ? this.data?.designationId : ''
    }
    this.officeForm = this.fb.group({
      id: [this.data ? this.data?.id : 0],
      departmentId: [this.data ? this.data?.departmentId : '', [Validators.required]],
      departmentLevelId: [this.data ? this.data?.departmentLevelId : '', [Validators.required]],
      stateId: [this.data?.stateId || this.webService.getStateId()],
      districtId: [this.data ? this.data?.districtId : this.webService.getDistrictId()],
      blockId: [this.data?.blockId || '', [Validators.required]],
      talukaId: [this.data?.talId || '', [Validators.required]],
      circleId: [this.data?.circleId || '', [Validators.required]],
      grampanchayatId: [this.data?.grampanchayatId || '', [Validators.required]],
      designationId: [this.data ? this.data?.designationId : '', [Validators.required]],
      name: [this.data?.name || '', [Validators.required, Validators.pattern(this.validator.fullName), this.validator.maxLengthValidator(50)]],
      m_Name: [this.data?.m_Name || '', [Validators.required, Validators.pattern(this.validator.marathi), this.validator.maxLengthValidator(50)]],
      mobNo1: [this.data?.mobNo1 || '', [Validators.required, Validators.pattern(this.validator.mobile_No)]],
      emailId: [this.data?.emailId || '', [Validators.required, Validators.email, this.validator.maxLengthValidator(50)]],
      address: [this.data?.address || '', [this.validator.maxLengthValidator(100)]],
      m_Address: [this.data?.m_Address || '', [this.validator.maxLengthValidator(100), Validators.pattern(this.validator.marathi)]],
      flag: [this.data ? "u" : "i"],
      createdBy: [this.WebStorageService.getUserId()]
    })
    this.dropDownCall(this.data?.departmentLevelId, true)
  }

  get f() { return this.officeForm.controls; }

  getDepartment() {
    this.departmentArray = [];
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        this.departmentArray = res.responseData;
        this.data ? (this.f['departmentId'].setValue(this.data?.departmentId)) : ''
      }), error: (() => {
        this.departmentArray = [];
      })
    })
  }

  getDesignation() {
    this.designationArray = [];
    let deptId = this.officeForm.getRawValue().departmentId;
    let deptLevelId = this.officeForm.getRawValue().departmentLevelId;
    if (deptId != 0) {
      this.masterService.GetDesignationDropDownOnDeptLevel(deptId, deptLevelId).subscribe({
        next: ((res: any) => {
          this.designationArray = res.responseData;
          // this.data ? (this.f['designationId'].setValue(this.data?.designationId)) : '';
        }), error: (() => {
          this.designationArray = [];
        })
      })
    }
  }

  getDepartmentLevel() {
    this.departmentLevelArray = [];
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        this.departmentLevelArray = res.responseData;
        this.data ? (this.f['departmentLevelId'].setValue(this.data?.departmentLevelId), this.getDesignation()) : ''
      }), error: (() => {
        this.departmentLevelArray = [];
      })
    })
  }

  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
      }), error: (() => {
        this.stateArray = [];
      })
    })
  }

  getDisrict(flag?: any) {
    this.districtArray = [];
    this.masterService.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.officeForm.value.departmentLevelId != 2 && this.officeForm.value.departmentLevelId != 5 || this.data ? (this.f['districtId'].setValue(this.data?.districtId || 1), this.getTaluka(flag)) : ''
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  getBlock(flag?: any) {
    this.blockArray = [];
    this.masterService.GetAllBlock(1, 1).subscribe({
      next: ((res: any) => {
        this.blockArray = res.responseData;
        (this.data && flag) ? (this.f['blockId'].setValue(this.data?.blockId)) : '';
      }), error: (() => {
        this.blockArray = [];
      })
    })
  }

  getTaluka(flag?: any) {
    this.talukaArray = [];
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        (this.officeForm.value.departmentLevelId != 4 && this.officeForm.value.departmentLevelId != 1 || (this.data && flag)) ? (this.f['talukaId'].setValue(this.data?.talId), this.getGrampanchayat()) : '';
      }), error: (() => {
        this.talukaArray = [];
      })
    })
  }

  getGrampanchayat() {
    this.grampanchayatArray = [];
    let talukaId = this.officeForm.getRawValue().talukaId || 0;
    if (talukaId != 0) {
      this.masterService.GetGrampanchayat(talukaId).subscribe({
        next: ((res: any) => {
          this.grampanchayatArray = res.responseData;
          // this.data ? (this.f['grampanchayatId'].setValue(this.data?.grampanchayatId)) : '';
        }), error: (() => {
          this.grampanchayatArray = [];
        })
      })
    }
  }

  getCircle(flag?: any) {
    this.circleArray = [];
    let stateId = this.officeForm.getRawValue().stateId;
    let distId = this.officeForm.getRawValue().districtId;
    this.masterService.GetAllCircle(stateId, distId, 0).subscribe({
      next: ((res: any) => {
        this.circleArray = res.responseData;
        (this.data && flag) ? (this.f['circleId'].setValue(this.data?.circleId)) : '';
      }), error: (() => {
        this.circleArray = [];
      })
    })
  }

  getDataById() {
    this.spinner.show();
    this.apiService.setHttp('GET', 'sericulture/api/UserRegistration/get-user-details?Id=' + (this.data?.id || 0), false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;
        } else {
          this.spinner.hide();
          this.tableDataArray = [];
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status);
      },
    });
  }
  onSubmitData() {
    let formData = this.officeForm.getRawValue();
    this.f['talukaId'].setValue(formData.departmentLevelId == 5 || formData.departmentLevelId == 2 ? formData.talukaId = 0 : formData.talukaId);
    this.f['blockId'].setValue(formData.departmentLevelId == 1 || formData.departmentLevelId == 5 || formData.departmentLevelId == 3 || formData.departmentLevelId == 4 ? formData.blockId = 0 : formData.blockId);
    this.f['circleId'].setValue(formData.departmentLevelId == 2 || formData.departmentLevelId == 5 || formData.departmentLevelId == 3 || formData.departmentLevelId == 4 ? formData.circleId = 0 : formData.circleId);
    this.f['grampanchayatId'].setValue(formData.departmentLevelId == 2 || formData.departmentLevelId == 5 || formData.departmentLevelId == 4 || formData.departmentLevelId == 1 ? formData.grampanchayatId = 0 : formData.grampanchayatId);
    if (this.officeForm.invalid) {
      this.spinner.hide();
      return
    } else {
      let obj = {
        ...formData,
        crcRegNo: "",
        aadharNumber: "",
        gender: 1,
        dob: new Date(),
        mobNo2: "",
        pinCode: "",
        officeAddressId: 0,
        totalAreaForCRC: 0,
        areaUnderCRC: 0,
        chalkyCapacity: 0,
        officerAssignArea: "",
        chalkyApprovedQty: 0,
        doj: new Date(),
        crcName: "",
        m_CRCName: "",
        userName: "",
        password: "",
        profileImagePath: "",
        userTypeId: 2,
        village: "0"
      }
      this.apiService.setHttp('post', 'sericulture/api/UserRegistration/insert-update-user-details?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.formDirective.resetForm();
          }
          else {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.errorHandler.handelError(error.status);
        }
      })
    }
  }

  dropDownCall(id?: any, flag?: any) {
    this.getState();
    this.getDisrict(flag);
    if (id == 1) {
      this.getCircle(flag)
    } else if (id == 2) {
      this.getBlock(flag)
    };
  }

  clearDropDown(flag?: any) {
    if (flag == 'deptLevelClear') {
      this.f['designationId'].setValue('');
      this.designationArray = [];
      this.f['circleId'].setValue('');
      this.circleArray = [];
      this.f['blockId'].setValue('');
      this.blockArray = [];
      this.f['talukaId'].setValue('');
      this.talukaArray = [];
      this.f['grampanchayatId'].setValue('');
      this.grampanchayatArray = [];
    }else {
      this.f['grampanchayatId'].setValue('');
      this.grampanchayatArray = [];
    }
  }

  getstatusForm() {
    this.statusForm = this.fb.group({
      remark: [this.data ? this.data?.reason : ''],
      statusId: [this.data?.activeStatus == 'In Active' ? 0 : 1]
    })
  }

  get fs() { return this.statusForm.controls; }

  sendData(id?: any) {
    id == 1 ? (this.showFlag = false, this.statusForm.controls['remark'].setValue('')) :this.showFlag = true
    if (id == 0) {
      this.statusForm.controls["remark"].clearValidators();
      this.statusForm.controls['remark'].setValidators([Validators.required]);
      this.statusForm.controls["remark"].updateValueAndValidity();
    } else {
      this.statusForm.controls["remark"].clearValidators();
      this.statusForm.controls['remark'].setValidators([]);
      this.statusForm.controls["remark"].updateValueAndValidity();
    }
  }

  submitStatusData() {
    this.spinner.show();
    let formData = this.statusForm.value;
    console.log('formData', formData);
    if (this.statusForm.invalid) {
      this.spinner.hide();
      return
    } else {
      let obj = {
        "id": this.data?.id,
        "isActive": formData.statusId == 0 ? true : false,
        "reason": formData.statusId == 1 ? "" : formData.remark
      }
      this.apiService.setHttp('put', 'sericulture/api/UserRegistration/User-Active-Status?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
          }
          else {
            this.commonMethod.checkDataType(res.statusMessage) == false
              ? this.errorHandler.handelError(res.statusCode)
              : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.errorHandler.handelError(error.status);
        }
      })
    }
  }

  resetStatus() {
    this.statusForm.reset();
    this.getstatusForm();
  }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.imageResponse = res.responseData;
          setTimeout(() => {
            this.onSubmitProfileData();
          }, 500);
        }
        else {
          this.clearlogo.nativeElement.value = "";
          this.imageResponse = "";
        }
      }),
      error: (error: any) => {
        this.clearlogo.nativeElement.value = "";
        this.spinner.hide();
        this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  onSubmitProfileData() {
    let obj =
    {
      "id": this.tableDataArray[0].id,
      "imagePath": this.imageResponse
    }
    this.apiService.setHttp('put', 'sericulture/api/UserRegistration/Upload-Image_web?lan=' + this.lang, false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.getDataById();
        }
        else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(error.status);
      }
    })
  }

  clearFormData() {
    this.formDirective.resetForm();
    this.data = null;
    this.getFormData();
  }
}


