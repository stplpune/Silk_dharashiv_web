import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-register-officer',
  templateUrl: './register-officer.component.html',
  styleUrls: ['./register-officer.component.scss']
})
export class RegisterOfficerComponent {
  officerFrm !: FormGroup;
  departmentArray = new Array();
  departmentLevelArray = new Array();
  stateArray = new Array();
  districtArray = new Array();
  designationArray = new Array();
  talukaArray = new Array();
  villageArray = new Array();
  blockArray = new Array();
  circleArray = new Array();
  editFlag: boolean = false;
  @ViewChild('formDirective')
  private formDirective!: NgForm;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public validation: ValidationService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    private WebStorageService: WebStorageService,
    private commonMethod: CommonMethodsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<RegisterOfficerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit() {
    this.data ? this.onEdit() : this.formData();
   
    this.getDepartment();
    this.getDepartmentLevel();
    this.getState();
    this.getDistrict();
    this.getTaluka();
    this.getBlock();
    this.getDesignation();
  }

  get f() {
    return this.officerFrm.controls;
  }
  formData(data?: any) {
    console.log("eeeeeeeeee",this.editFlag)
    this.officerFrm = this.fb.group({
      "id": [data ? data?.id : 0],
      "departmentId": [data ? data?.departmentId : 0],
      "departmentLevelId": [data ? data?.departmentLevelId : 0],
      "stateId": [{ value: 1, disabled: true }],
      "districtId": [{ value: 1, disabled: true }],
      "talukaId": [data ? data?.talukaId : 0],
      "villageId": [data ? data?.villageId : 0],
      "blockId": [data ? data?.blockId : 0],
      "circleId": [data ? data?.circleId : 0],
      "designationId":[data ? data?.designationId : 0],
      "name": [data ? data?.name :''],
      "m_Name": [data ? data?.m_Name :''],
      "mobNo1": [data ? data?.mobNo1 :''],
      "emailId": [data ? data?.emailId :''],
      "address": [data ? data?.address :''],
      "m_Address":[data ? data?.m_Address :''],
      "userName": [data ? data?.userName :''],
      "password": [data ? data?.password :'0'],
      "flag":[this.editFlag ? "u" : "i"]
      })
  }
  
  //edit function
  onEdit() {
    this.editFlag = true;
    this.formData(this.data);
  }

  //submit & update function
  onClickSubmit() {
    this.spinner.show();
    if (!this.officerFrm.valid) {
      this.spinner.hide();
      return;
    } else {
      let data = this.officerFrm.getRawValue();
      let obj = {
        "crcRegNo": "string",
        "aadharNumber": "string",
        "gender": true,
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
      }
      let mainData = { ...data, ...obj, "createdBy": this.WebStorageService.getUserId() };
      this.apiService.setHttp('post', 'sericulture/api/UserRegistration/insert-update-user-details', false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.formDirective.resetForm();
            this.editFlag = false;
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


  getDepartment() {
    this.departmentArray = [];
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentArray = res.responseData;
          this.editFlag ? this.officerFrm.controls['departmentId'].setValue(this.data?.departmentId) : '';
        }
        else {
          this.departmentArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }

  getDepartmentLevel() {
    this.departmentLevelArray = [];
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentLevelArray = res.responseData;
          this.editFlag ? this.officerFrm.controls['departmentLevelId'].setValue(this.data?.departmentLevelId) : '';
  
        }
        else {
          this.departmentLevelArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }

  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
           this.editFlag == false ? this.officerFrm.controls['stateId'].patchValue(this.data?.stateId) : '';
        }
        else {
          this.stateArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }

  getDistrict() {
    this.districtArray = [];
    // let stateId=;
    this.masterService.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.districtArray = res.responseData;
          this.editFlag == false ? this.officerFrm.controls['districtId'].patchValue(this.data?.districtId) : '';
       }
        else {
          this.districtArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }

  getBlock() {
    this.blockArray = [];
    this.masterService.GetAllBlock(1, 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.blockArray = res.responseData;
          this.editFlag ? this.officerFrm.controls['blockId'].setValue(this.data?.blockId) : '';
       }
        else {
          this.blockArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }

  getTaluka() {
    this.talukaArray = [];
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.talukaArray = res.responseData;
          this.editFlag ? (this.officerFrm.controls['talukaId'].setValue(this.data?.talukaId),this.getCircle(),this.getVillage()) : (this.getCircle(),this.getVillage());
        }
        else {
          this.talukaArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
   }

  getCircle() {
    this.circleArray = [];
    let talukaId = this.officerFrm.getRawValue()?.talukaId;
    if (talukaId != 0) {
      this.masterService.GetAllCircle(1, 1, talukaId).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.circleArray = res.responseData;
            this.editFlag ? this.officerFrm.controls['circleId'].setValue(this.data?.circleId) : '';
          }
          else {
            this.circleArray = [];
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        })
      })
    }
  }


  getVillage() {
    this.villageArray = [];
    let talukaId = this.officerFrm.getRawValue()?.talukaId;
    if (talukaId != 0) {
      this.masterService.GetAllVillages(1, 1, talukaId, 0).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.villageArray = res.responseData;
            this.editFlag ? this.officerFrm.controls['villageId'].setValue(this.data?.villageId) : '';
          }
          else {
            this.villageArray = [];
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        })
      })
    }
  }

  getDesignation() {
    this.designationArray = [];
    this.masterService.GetDesignationDropDown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.designationArray = res.responseData;
          this.editFlag ? this.officerFrm.controls['designationId'].setValue(this.data?.designationId) : '';
         }
        else {
          this.designationArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }












}
