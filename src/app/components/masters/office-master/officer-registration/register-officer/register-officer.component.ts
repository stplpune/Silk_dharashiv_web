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
  villageArray = new Array();
  designationArray = new Array();
  @ViewChild('formDirective') private formDirective!: NgForm;
  @ViewChild('uplodLogo') clearlogo!: any;
  tableDataArray = new Array();
  statusArray = [{ id: 0, 'value': 'In Active' }, { id: 1, 'value': 'Active' }];
  showFlag: boolean = false;
  statusForm!: FormGroup;
  imageResponse: string = '';
  subscription!: Subscription;
  lang: string = 'English';
  constructor
    (
      private fb: FormBuilder,
      private masterService: MasterService,
      private errorHandler: ErrorHandlingService,
      private commonMethod: CommonMethodsService,
      private dialogRef: MatDialogRef<RegisterOfficerComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private spinner: NgxSpinnerService,
      private WebStorageService: WebStorageService,
      private apiService: ApiService,
      public validator: ValidationService,
      private fileUpl: FileUploadService,
  ) { }


  ngOnInit() {
    this.getFormData();
    this.getstatusForm();
    this.getDepartment();
    this.getDepartmentLevel();
    this.getDesignation();
    this.data?.label == 'View' ? (this.viewFlag = true, this.getDataById()) : this.viewFlag = false;
  }


  getFormData() {
    this.officeForm = this.fb.group({
      id: [this.data ? this.data?.id : 0],
      departmentId: [this.data ? this.data?.id : '', [Validators.required]],
      departmentLevelId: [this.data ? this.data?.departmentId : '', [Validators.required]],
      stateId: [this.data ? this.data?.stateId : 1],
      districtId: [this.data ? this.data?.districtId : 1],
      blockId: [this.data ? this.data?.blockId : '', [Validators.required]],
      talukaId: [this.data ? this.data?.talukaId : '', [Validators.required]],
      circleId: [this.data ? this.data?.circleId : '', [Validators.required]],
      villageId: [this.data ? this.data?.villageId : '', [Validators.required]],
      designationId: [this.data ? this.data?.designationId : '', [Validators.required]],
      name: [this.data ? this.data?.name : '', [Validators.required, Validators.pattern(this.validator.name), this.validator.maxLengthValidator(50)]],
      m_Name: [this.data ? this.data?.m_Name : '', [Validators.required, Validators.pattern(this.validator.marathi), this.validator.maxLengthValidator(50)]],
      mobNo1: [this.data ? this.data?.mobNo1 : '', [Validators.required, Validators.pattern(this.validator.mobile_No)]],
      emailId: [this.data ? this.data?.emailId : '', [Validators.required, Validators.email, this.validator.maxLengthValidator(50)]],
      address: [this.data ? this.data?.address : '',[this.validator.maxLengthValidator(100)]],
      m_Address: [this.data ? this.data?.m_Address : '', [this.validator.maxLengthValidator(100),Validators.pattern(this.validator.marathi)]],
      flag: [this.data ? "u" : "i"],
      createdBy: [this.WebStorageService.getUserId()]
    })
  }
  get f() { return this.officeForm.controls; }

  getDepartment() {
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        this.departmentArray = res.responseData;
        this.data ? (this.f['departmentId'].setValue(this.data?.departmentId)) : ''
      }), error: (() => {
        this.departmentArray = [];
      })
    })
  }

  getDepartmentLevel() {
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        this.departmentLevelArray = res.responseData;
        this.data ? (this.f['departmentLevelId'].setValue(this.data?.departmentLevelId)) : ''
      }), error: (() => {
        this.departmentLevelArray = [];
      })
    })
  }

  getState() {
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        console.log('form', this.officeForm.value.departmentLevelId);
        console.log('this.data?.stateId', this.data?.departmentLevelId);
        this.stateArray = res.responseData;
        this.data ? (this.f['stateId'].setValue(this.data?.stateId)) : '';
      }), error: (() => {
        this.stateArray = [];
      })
    })
  }

  getDisrict() {
    this.masterService.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        (this.officeForm.value.departmentLevelId != 2 && this.officeForm.value.departmentLevelId != 5) ? (this.f['districtId'].setValue(this.data?.districtId || 1), this.getTaluka()) : '';
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  getBlock() {
    this.masterService.GetAllBlock(1, 1).subscribe({
      next: ((res: any) => {
        this.blockArray = res.responseData;
        this.data ? (this.f['blockId'].setValue(this.data?.blockId)) : '';
      }), error: (() => {
        this.blockArray = [];
      })
    })
  }

  getTaluka() {
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        (this.officeForm.value.departmentLevelId != 4 && this.officeForm.value.departmentLevelId != 1) ? (this.f['talukaId'].setValue(this.data?.talukaId), this.getVillage()) : '';
      }), error: (() => {
        this.talukaArray = [];
      })
    })
  }

  getCircle() {
    let stateId = this.officeForm.getRawValue().stateId;
    let distId = this.officeForm.getRawValue().districtId;
    this.masterService.GetAllCircle(stateId, distId, 0).subscribe({
      next: ((res: any) => {
        this.circleArray = res.responseData;
        this.data ? (this.f['circleId'].setValue(this.data?.circleId)) : '';
      }), error: (() => {
        this.circleArray = [];
      })
    })
  }

  getVillage() {
    let stateId = this.officeForm.getRawValue().stateId;
    let distId = this.officeForm.getRawValue().districtId;
    let talukaId = this.officeForm.getRawValue().talukaId;
    this.masterService.GetAllVillages(stateId, distId, talukaId || 0, 0).subscribe({
      next: ((res: any) => {
        this.villageArray = res.responseData;
        this.data ? (this.f['villageId'].setValue(this.data?.villageId)) : '';
      }), error: (() => {
        this.villageArray = [];
      })
    })
  }

  getDesignation() {
    this.masterService.GetDesignationDropDown().subscribe({
      next: ((res: any) => {
        this.designationArray = res.responseData;
        this.data ? (this.f['designationId'].setValue(this.data?.designationId)) : '';
      }), error: (() => {
        this.designationArray = [];
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
          console.log(" this.tableDataArray", this.tableDataArray);
          
          // this.imageResponse = this.data?.profileImagePath ?  this.data?.profileImagePath : ''
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
    if (this.officeForm.invalid) {
      this.spinner.hide();
    } else {
      formData.blockId = formData.blockId ? formData.blockId : 0;
      formData.talukaId = formData.talukaId ? formData.talukaId : 0;
      formData.circleId = formData.circleId ? formData.circleId : 0;
      formData.villageId = formData.villageId ? formData.villageId : 0;
      let obj = {
        ...formData,
        "crcRegNo": "string",
        "aadharNumber": "string",
        "gender": 1,
        "dob": new Date(),
        "mobNo2": "string",
        "pinCode": "string",
        "officeAddressId": 0,
        "totalAreaForCRC": 0,
        "areaUnderCRC": 0,
        "chalkyCapacity": 0,
        "officerAssignArea": "string",
        "chalkyApprovedQty": 0,
        "doj": new Date(),
        "crcName": "string",
        "m_CRCName": "string",
        "userName": "string",
        "password": "string",
        "profileImagePath": "string",
      }
      this.apiService.setHttp('post', 'sericulture/api/UserRegistration/insert-update-user-details', false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.formDirective.resetForm();
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

  dropDownCall(id?: any) {
    if (id == 1) {
      this.getState();
      this.getDisrict();
      this.getCircle();
    } else if (id == 2) {
      this.getState();
      this.getDisrict();
      this.getBlock();
    } else if (id == 3) {
      this.getState();
      this.getDisrict();
    } else if (id == 4) {
      this.getState();
      this.getDisrict();
    } else if (id == 5) {
      this.getState();
      this.getDisrict();
    }

  }
  getstatusForm() {
    this.statusForm = this.fb.group({
      remark: [this.data ? this.data?.reason : ''],
      statusId: [this.data?.activeStatus == 'In Active' ? 0 : 1]
    })
  }
  sendData(id: any) {
    id == 1  ? (this.showFlag = false,this.statusForm.controls['remark'].setValue('')) : this.showFlag = true;      
  }

  submitStatusData() {
    this.spinner.show();
    let formData = this.statusForm.value;
    if (this.statusForm.invalid) {
      return
    } else {
      let obj = {
        "id": this.data?.id,
        "isActive": formData.statusId == 0 ? true : false,
        "reason": formData.statusId == 1 ? "" : formData.remark
      }
      this.apiService.setHttp('put', 'sericulture/api/UserRegistration/User-Active-Status', false, obj, false, 'masterUrl');
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

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.imageResponse = res.responseData;
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


}
