import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { ReplaySubject, Subscription } from 'rxjs';

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
  statusArray = [{ id: 0, 'value': 'InActive', 'mr_value': 'निष्क्रिय' }, { id: 1, 'value': 'Active', 'mr_value': 'सक्रिय' }];

  departmentctrl: FormControl = new FormControl();
  departmentLevelSubject: ReplaySubject<any> = new ReplaySubject<any>();

  departmentLevelCtrl: FormControl = new FormControl();
  departmentSubject: ReplaySubject<any> = new ReplaySubject<any>();

  designationCtrl: FormControl = new FormControl();
  designationSubject: ReplaySubject<any> = new ReplaySubject<any>();

  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();

  blockCtrl: FormControl = new FormControl();
  blockSubject: ReplaySubject<any> = new ReplaySubject<any>();

  circleCtrl: FormControl = new FormControl();
  circleSubject: ReplaySubject<any> = new ReplaySubject<any>();

  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();
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
      public webService: WebStorageService
    ) { }


  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getFormData();
    // this.getstatusForm();
    this.searchDataZone();
    this.data?.label == 'View' ? (this.viewFlag = true, this.getDataById()) : (this.viewFlag = false, this.getDepartment());
  }


  getFormData() {
    if (this.data) {
      this.data.blockId = this.data?.blockId != 0 ? this.data?.blockId : ''
      this.data.talId = this.data?.talId != 0 ? this.data?.talId : ''
      this.data.circleId = this.data?.circleId != 0 ? this.data?.circleId : ''
      this.data.grampanchayatId = this.data?.grampanchayatId != 0 ? this.data?.grampanchayatId : ''
      this.data.designationId = this.data?.designationId != 0 ? this.data?.designationId : ''
    }``
    this.officeForm = this.fb.group({
      id: [this.data ? this.data?.id : 0],
      departmentId: [this.data ? this.data?.departmentId : '', [Validators.required]],
      departmentLevelId: [this.data ? this.data?.departmentLevelId : '', [Validators.required]],
      stateId: [this.data?.stateId || this.webService.getStateId() == '' ? 0 : this.webService.getStateId()],
      districtId: [this.data ? this.data?.districtId : this.webService.getDistrictId() == '' ? 0 : this.webService.getDistrictId()],
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
      m_Address: [this.data?.m_Address || '', [this.validator.maxLengthValidator(100), Validators.pattern(this.validator.marathiquestion)]],
      flag: [this.data ? "u" : "i"],
      createdBy: [this.WebStorageService.getUserId()]
    })
    this.dropDownCall(this.data?.departmentLevelId, true)
  }

  get f() { return this.officeForm.controls; }


  searchDataZone() {
    this.departmentctrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.departmentArray, this.departmentctrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.departmentSubject) });
    this.departmentLevelCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.departmentLevelArray, this.departmentLevelCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.departmentLevelSubject) });
    this.designationCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.designationArray, this.designationCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.designationSubject) });
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.blockCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.blockArray, this.blockCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.blockSubject) });
    this.circleCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.circleArray, this.circleCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.circleSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }

  getDepartment() {
    this.departmentArray = [];
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        this.departmentArray = res.responseData;
        this.commonMethod.filterArrayDataZone(this.departmentArray, this.departmentctrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.departmentSubject);
        this.data ? (this.f['departmentId'].setValue(this.data?.departmentId), this.getDepartmentLevel()) : ''
      }), error: (() => {
        this.departmentArray = [];
        this.departmentSubject.next(null);
      })
    })
  }

  getDepartmentLevel() {
    this.departmentLevelArray = [];
    let deptId = this.officeForm.getRawValue().departmentId || 0;
    if (deptId != 0) {
      this.masterService.GetDeptLevelDropDown().subscribe({
        next: ((res: any) => {
          this.departmentLevelArray = res.responseData;
          this.commonMethod.filterArrayDataZone(this.departmentLevelArray, this.departmentLevelCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.departmentLevelSubject);
          this.getDesignation()
        }), error: (() => {
          this.departmentLevelArray = [];
          this.departmentLevelSubject.next(null);
        })
      })
    }

  }

  getDesignation() {
    this.designationArray = [];
    let deptId = this.officeForm.getRawValue().departmentId || 0;
    let deptLevelId = this.officeForm.getRawValue().departmentLevelId || 0;
    if (deptId != 0 && deptLevelId != 0) {
      this.masterService.getDesignationOnDeptID(deptId, deptLevelId).subscribe({
        next: ((res: any) => {
          this.designationArray = res.responseData;
          this.commonMethod.filterArrayDataZone(this.designationArray, this.designationCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.designationSubject);
        }), error: (() => {
          this.designationArray = [];
          this.designationSubject.next(null);
        })
      })
    }
  }


  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
        this.data ? (this.f['stateId'].setValue(this.data?.stateId)) : ''
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
        this.officeForm.value.departmentLevelId != 2 && this.officeForm.value.departmentLevelId != 1 || this.data ? (this.f['districtId'].setValue(this.data?.districtId || 1), this.getTaluka(flag)) : ''
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
        this.commonMethod.filterArrayDataZone(this.blockArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.blockSubject);
        (this.data && flag) ? (this.f['blockId'].setValue(this.data?.blockId)) : '';
      }), error: (() => {
        this.blockArray = [];
        this.blockSubject.next(null);
      })
    })
  }

  getTaluka(flag?: any) {
    this.talukaArray = [];
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
        (this.officeForm.value.departmentLevelId != 4 && this.officeForm.value.departmentLevelId != 4 || (this.data && flag)) ? (this.f['talukaId'].setValue(this.data?.talId), this.getGrampanchayat(), this.getCircle()) : '';
      }), error: (() => {
        this.talukaArray = [];
        this.talukaSubject.next(null);
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
          this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
        }), error: (() => {
          this.grampanchayatArray = [];
          this.gramPSubject.next(null);
        })
      })
    }
  }

  getCircle() {
    this.circleArray = [];
    let stateId = this.officeForm.getRawValue().stateId;
    let distId = this.officeForm.getRawValue().districtId;
    let talukaId = this.officeForm.getRawValue().talukaId || 0;
    this.masterService.GetAllCircle(stateId, distId, talukaId).subscribe({
      next: ((res: any) => {
        this.circleArray = res.responseData;
        this.commonMethod.filterArrayDataZone(this.circleArray, this.circleCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.circleSubject);
      }), error: (() => {
        this.circleArray = [];
        this.circleSubject.next(null);
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
    this.f['talukaId'].setValue(formData.departmentLevelId == 1 || formData.departmentLevelId == 2 ? formData.talukaId = 0 : formData.talukaId);
    this.f['blockId'].setValue(formData.departmentLevelId == 4 || formData.departmentLevelId == 1 || formData.departmentLevelId == 5 || formData.departmentLevelId == 3 ? formData.blockId = 0 : formData.blockId);
    this.f['circleId'].setValue(formData.departmentLevelId == 2 || formData.departmentLevelId == 1 || formData.departmentLevelId == 5 || formData.departmentLevelId == 3 ? formData.circleId = 0 : formData.circleId);
    this.f['grampanchayatId'].setValue(formData.departmentLevelId == 2 || formData.departmentLevelId == 1 || formData.departmentLevelId == 3 || formData.departmentLevelId == 4 ? formData.grampanchayatId = 0 : formData.grampanchayatId);
    if (this.officeForm.invalid) {
      this.spinner.hide();
      return
    } else {
      let obj = {
        ...formData,
        crcRegNo: "",
        aadharNumber: "",
        gender: 0,
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
        profileImagePath: this.imageResponse? this.imageResponse : this.data?.profileImagePath ,
        userTypeId: 2, // officer register
        village: "0",
        certificateExpiryDate:new Date(),
        certificateIssueDate: new Date(),
        certificatePath: "",
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
    if (id == 2) {
      this.getBlock(flag)
    }
  }

  clearDropDown(flag?: any) {
    if (flag == 'deptLevelClear') {
      this.designationSubject = new ReplaySubject<any>();
      this.designationArray = [];
      this.f['designationId'].setValue('');
      this.circleSubject = new ReplaySubject<any>();
      this.circleArray = [];
      this.f['circleId'].setValue('');
      this.blockSubject = new ReplaySubject<any>();
      this.blockArray = [];
      this.f['blockId'].setValue('');
      this.talukaSubject = new ReplaySubject<any>();
      this.talukaArray = [];
      this.f['talukaId'].setValue('');
      this.gramPSubject = new ReplaySubject<any>();
      this.grampanchayatArray = [];
      this.f['grampanchayatId'].setValue('');
    } else if (flag == 'levelclear') {
      this.f['departmentLevelId'].setValue('');
      this.departmentLevelSubject = new ReplaySubject<any>();
      this.departmentLevelArray = [];
      this.designationSubject = new ReplaySubject<any>();
      this.designationArray = [];
      this.f['designationId'].setValue('');
    } else {
      this.circleSubject = new ReplaySubject<any>();
      this.circleArray = [];
      this.f['circleId'].setValue('');
      this.gramPSubject = new ReplaySubject<any>();
      this.grampanchayatArray = [];
      this.f['grampanchayatId'].setValue('');
    }
  }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc', '', '', this.lang).subscribe({
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

  deleteImage(){
    this.clearlogo.nativeElement.value="";
    this.imageResponse="";
    this.data ? this.data.profileImagePath="" : '';
  }
 
  clearFormData() {
    this.formDirective.resetForm();
    this.data = null;
    this.getFormData();
    this.designationArray = [];
    this.departmentLevelArray = [];
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.departmentSubject?.unsubscribe();
    this.departmentLevelSubject?.unsubscribe();
    this.designationSubject?.unsubscribe();
    this.talukaSubject?.unsubscribe();
    this.blockSubject?.unsubscribe();
    this.circleSubject?.unsubscribe();
    this.gramPSubject?.unsubscribe();
  }
}
