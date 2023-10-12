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
    this.formData(this.data);
    // this.formData();
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
    console.log(data)
    this.officerFrm = this.fb.group({
      "id": [0],
      "departmentId": [0],
      "departmentLevelId": [0],
      "stateId": [1],
      "districtId": [1],
      "talukaId": [0],
      "villageId": [0],
      "blockId": [0],
      "circleId": [0],
      "designationId": [0],
      "name": [''],
      "m_Name": [''],
      "mobNo1": [''],
      "emailId": [''],
      "address": [''],
      "m_Address": [''],
      "userName": [''],
      "password": [''],
      "flag":[this.editFlag ? "u" : "i"]
      })
  }
  // this.dialogRef.close('Yes')

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
          // this.editFlag == false ? this.officerFrm.controls['stateId'].patchValue(this.stateArray[0].textEnglish) : '';
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
          //   this.officerFrm.controls['districtId'].setValue(1);
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
    // let blockId = this.officerFrm.value?.blockId;
    // if(blockId != 0){
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.talukaArray = res.responseData;
        }
        else {
          this.talukaArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
    // }
  }

  getCircle() {
    this.circleArray = [];
    let talukaId = this.officerFrm.value?.talukaId;
    // alert("jhghjgjg")
    if (talukaId != 0) {
      this.masterService.GetAllCircle(1, 1, talukaId).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.circleArray = res.responseData;
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
    let talukaId = this.officerFrm.value?.talukaId;
    console.log("in village talId", talukaId)
    if (talukaId != 0) {
      this.masterService.GetAllVillages(1, 1, talukaId, 0).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.villageArray = res.responseData;
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
        }
        else {
          this.designationArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }












}
