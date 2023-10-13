import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import {  MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-set-rule-modal',
  templateUrl: './set-rule-modal.component.html',
  styleUrls: ['./set-rule-modal.component.scss']
})
export class SetRuleModalComponent {

  setRulefrm!: FormGroup;
  statresponse = new Array();
  districtresp = new Array();
  schemeTyperesp = new Array();
  departmentresp = new Array();
  actionresp = new Array();
  levelResp = new Array();
  designationResp = new Array();
  approveLevelResp= new Array();
  @ViewChild('formDirective') private formDirective!: NgForm;
  constructor(private fb: FormBuilder,
    private master: MasterService,
    private commonMethods: CommonMethodsService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private error: ErrorHandlingService,
    public dialogRef: MatDialogRef<SetRuleModalComponent>,
  ) { }

  ngOnInit() {
    this.defaultFrom();
    this.getSchemeType();
    this.getDepartment();
    this.getState();
    this.getDisrict();
    this.getAction();
    this.getLevel();
    this.getDesignation();
    this.getLevelApprovel();
  }


  defaultFrom() {
    this.setRulefrm = this.fb.group({
      scheme: ['', [Validators.required]],
      department: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: ['', [Validators.required]],
      approvalLevels: this.fb.array([])
    })
  }

  get f(){
    return this.setRulefrm.controls;
  }
  get g(){
    return this.setRulefrm.controls['approvalLevels'].value;
  }
  get approvallistForm() { return this.setRulefrm.get('approvalLevels') as FormArray }

  addList() {
    console.log(this.approvallistForm.status);
    if (this.approvallistForm.length && this.approvallistForm.status == 'INVALID') {
      this.commonMethods.snackBar("Please Add Approval Details First", 1);
    }
    else {
      const data = this.fb.group({
        "actionId": ['', [Validators.required]],
        "departmentLevelId": ['', [Validators.required]],
        "designationId": ['', [Validators.required]],
        "approvalLevel": ['']
      })
      this.approvallistForm.push(data);
    }
  }



  getSchemeType() {
    this.master.GetAllSchemeType().subscribe({
      next: ((res: any) => {
        this.schemeTyperesp = res.responseData;
      }), error: (() => {
        this.schemeTyperesp = [];
      })
    })
  }

  getDepartment() {
    this.master.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        console.log(res);
        this.departmentresp = res.responseData;
      }), error: (() => {
        this.departmentresp = [];
      })

    })
  }

  getState() {
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.statresponse = res.responseData;
      }), error: (() => {
        this.statresponse = [];
      })
    })
  }

  getDisrict() {
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtresp = res.responseData;
      }), error: (() => {
        this.districtresp = [];
      })
    })
  }

  getAction() {
    this.master.GetActionDropDown().subscribe({
      next: ((res: any) => {
        this.actionresp = res.responseData;
      }), error: (() => {
        this.actionresp = [];
      })
    })
  }

  getLevel() {
    this.master.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        this.levelResp = res.responseData;
      }), error: (() => {
        this.levelResp = [];
      })
    })
  }

  getDesignation() {
    this.master.GetDesignationDropDown().subscribe({
      next: ((res: any) => {
        this.designationResp = res.responseData;
      }), error: (() => {
        this.designationResp = [];
      })
    })
  }

  getLevelApprovel(){
    this.master.GetLevelApproval().subscribe({
      next: ((res: any) => {
        this.approveLevelResp = res.responseData;
      }), error: (() => {
        this.approveLevelResp = [];
      })
    })
  }


  onSubmit() {

    let formData = this.setRulefrm.value;
    console.log(formData.approvalLevels.actionId);
   let Action= formData.approvalLevels.map((x:any)=>{
      return x.actionId;
    })
    console.log(Action);
    
    
    let duplicatAction = this.actionresp.some((ele: any) => {
      console.log(ele);
      return ele.id === Action // change
    });
    console.log(duplicatAction);



    if (this.setRulefrm.invalid) {
      return;
    }else if(duplicatAction){
  this.commonMethods.snackBar('Please select another Action', 1);
    }
    console.log(this.setRulefrm.value);
    let obj = {
      "schemeTypeId": formData.scheme,
      "departmentId": formData.department,
      "stateId": formData.state,
      "districtId": formData.district,
      "createdBy": 0,
      "flag": "i",
      "approvalLevels": formData.approvalLevels
    }




    this.apiService.setHttp('post', 'sericulture/api/ApprovalMaster/AddUpdateApprovalMasterLevels', false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.formDirective?.resetForm();
          this.dialogRef.close('Yes');

        } else {
          this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.error.handelError(error.statusCode);
      }
    });

  }

  clearForm() {
    this.formDirective?.resetForm();
  }

  deleteApproveLevel(i:any){
    this.approvallistForm.removeAt(i);
  }
}

