import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-set-rule-modal',
  templateUrl: './set-rule-modal.component.html',
  styleUrls: ['./set-rule-modal.component.scss']
})
export class SetRuleModalComponent implements OnDestroy{

  setRulefrm!: FormGroup;
  statresponse = new Array();
  districtresp = new Array();
  schemeTyperesp = new Array();
  departmentresp = new Array();
  actionresp = new Array();
  levelResp = new Array();
  designationResp = new Array();
  approveLevelResp = new Array();
  subscription!: Subscription;//used  for lang conv
  @ViewChild('formDirective') private formDirective!: NgForm;
  lang: any;
  isViewFlag: boolean = false;
  editFlag: boolean = false;
  displayedColumns: string[] = ['Sr.No', 'Order', 'Action', 'Designation Level', 'Designation'];
  tableData = new Array();
  constructor(private fb: FormBuilder,
    private master: MasterService,
    private commonMethods: CommonMethodsService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private error: ErrorHandlingService,
    private WebStorageService: WebStorageService,
    public dialogRef: MatDialogRef<SetRuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.defaultFrom();
    });
    this.isViewFlag = this.data?.label == 'View' ? true : false;
    this.defaultFrom();
    this.getSchemeType();
    this.getDepartment();
    this.getState();
    this.getDisrict();
    this.getAction();
    this.getLevel();
    this.getDesignation();
    this.getLevelApprovel();
    this.data?.label == 'Edit' ? this.editData() : '';
    this.tableData = this.data?.getApprovalMaster
  
  }

  //#region ------------------------------------------------------filter drop fn start heare--------------------------------------------//

  defaultFrom() {
    this.setRulefrm = this.fb.group({
      scheme: ['', [Validators.required]],
      department: ['', [Validators.required]],
      state: [1, [Validators.required]],
      district: [1, [Validators.required]],
      approvalLevels: this.fb.array([])
    })
  }

  get f() {
    return this.setRulefrm.controls;
  }

  get g() {
    return this.setRulefrm.controls['approvalLevels'].value;
  }

  get approvallistForm() { return this.setRulefrm.get('approvalLevels') as FormArray | any }


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

  //#endregion ------------------------------------------------------filter drop fn end heare--------------------------------------------//

  //#region ---------------------------------------------------------Add Level drop fn start heare--------------------------------------------//
  getAction() {
    this.master.GetActionDropDown().subscribe({
      next: ((res: any) => {
        this.actionresp = res.responseData;
        this.actionresp.unshift({ id: 0, textEnglish: 'Select Action', textMarathi: "कृती निवडा" })
      }), error: (() => {
        this.actionresp = [];
      })
    })
  }

  getLevel() {
    this.master.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        this.levelResp = res.responseData;
        this.levelResp.unshift({ id: 0, textEnglish: 'Select Designation Level', textMarathi: "पदनाम स्तर निवडा" })
      }), error: (() => {
        this.levelResp = [];
      })
    })
  }

  getDesignation() {
    this.master.GetDesignationDropDown().subscribe({
      next: ((res: any) => {
        this.designationResp = res.responseData;
        this.designationResp.unshift({ id: 0, textEnglish: 'Select Designation', textMarathi: "पदनाम निवडा" })
      }), error: (() => {
        this.designationResp = [];
      })
    })
  }

  getLevelApprovel() {
    this.master.GetLevelApproval().subscribe({
      next: ((res: any) => {
        this.approveLevelResp = res.responseData;
        this.approveLevelResp.map((ele: any) => { ele['selected'] = false })
        this.approveLevelResp.unshift({ id: 0, textEnglish: 'Select Order', textMarathi: "ऑर्डर निवडा" })
      }), error: (() => {
        this.approveLevelResp = [];
      })
    })
  }

  checkPrevData() {
    let formData = this.setRulefrm.getRawValue();

    if (formData.scheme == '') {
      this.commonMethods.snackBar("Please select scheme name", 1);
      return
    } else if (formData.department == '') {
      this.commonMethods.snackBar("Please select department name", 1);
      return
    } else if (this.setRulefrm.invalid) {
      return
    }
   
    else {
      this.spinner.show();
      let formData = this.setRulefrm.getRawValue();
      this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetAllApprovalMasterLevels?pageno=1&pagesize=10&SchemeTypeId=' + (formData.scheme || 0) + '&DepartmentId=' + (formData.department || 0) + '&StateId=' + (formData.state || 1) + '&DistrictId=' + (formData.district || 1) + '&lan=1', false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200' && res.responseData.length) {
            this.data = res.responseData[0];
            this.data.label = 'Edit';
            this.data?.label == 'Edit' ? this.editData() : ''
          } else {
            this.addList();
          }
        },
        error: (err: any) => {
          this.spinner.hide();
          this.error.handelError(err.status);
        },
      });
    }
  }

  addList() {
    if (this.setRulefrm.invalid && this.approvallistForm.length && this.approvallistForm.status == 'INVALID') {
      this.commonMethods.snackBar("Please Add Approval Details First", 1);
    }
    else {
      const data: any = this.fb.group({
        "actionId": ['', [Validators.required]],
        "departmentLevelId": ['', [Validators.required]],
        "designationId": ['', [Validators.required]],
        "approvalLevel": ['', [Validators.required]],
        "disabled": [false]
      });
      if (this.approvallistForm.length > 1) {
        let approvallistForm = this.approvallistForm.getRawValue();
        console.log(approvallistForm);
        
        let len = this.approvallistForm.length - 2;
        for (let i = 0; i <= len; i++) {
          if ((approvallistForm[i]?.approvalLevel == approvallistForm[approvallistForm.length - 1]?.approvalLevel)) {
            this.commonMethods.snackBar("Duplicate Order level is not allowed", 1);
            return
          }else  if ((approvallistForm[i]?.actionId == approvallistForm[approvallistForm.length - 1]?.actionId)) {
            this.commonMethods.snackBar("Duplicate Action is not allowed", 1);
            return
          }
           else if ((approvallistForm[i]?.actionId == approvallistForm[approvallistForm.length - 1]?.actionId) &&
            approvallistForm[i]?.departmentLevelId == approvallistForm[approvallistForm.length - 1]?.departmentLevelId && (approvallistForm[i]?.designationId == approvallistForm[approvallistForm.length - 1]?.designationId)) {
            this.commonMethods.snackBar("Duplicate Record Not Allowed", 1);
            return
          }
        }
        (this.approveLevelResp.length - 1) == approvallistForm.length ? this.commonMethods.snackBar("Exceed Limit", 1) : this.approvallistForm.push(data)
        this.approvallistForm.controls[approvallistForm.length - 1].controls['disabled']?.setValue(true);
      } else {
        this.approvallistForm.push(data);
        this.approvallistForm.length == 2 ? this.approvallistForm.controls[0].controls['disabled'].setValue(true) : '';
      }
    }
  }


  editData() {
    this.editFlag = true;
    this.setRulefrm.patchValue({
      scheme: this.data.schemeTypeId,
      department: this.data.departmentId,
      state: this.data.stateId,
      district: this.data.districtId,
      approvalLevels: this.data.id
    });

    (this.data?.getApprovalMaster as Array<any>).forEach((x: any) => {
      this.approvallistForm.push(this.fb.group(
        {
          id: [x?.id],
          actionId: [x?.actionId],
          departmentLevelId: [x?.departmentLevelId],
          designationId: [x?.designationId],
          approvalLevel: [x?.approvalLevel],
          disabled: [true]
        }
      ));
    });
  }

  deleteApproveLevel(i: any) {
    this.approvallistForm.removeAt(i);
  }

 
  onSubmit() {
    let formData = this.setRulefrm.getRawValue();
    if (this.setRulefrm.invalid) {
      return;
    } else if ((this.approveLevelResp.length - 1) != this.approvallistForm.length) {
      this.commonMethods.snackBar('All Order leavel is required', 1);
      return
    }
    this.spinner.show();
    let addLevelArrayStatus = formData.approvalLevels.some((x: any) => {
      let counter = 0;
      formData.approvalLevels.map((a: any) => {
        if (a.actionId === x.actionId && a.departmentLevelId === x.departmentLevelId && a.designationId === x.designationId) {
          counter += 1;
        }
      })
      return counter > 1;
    });
   
    if (addLevelArrayStatus) {
      this.commonMethods.snackBar("Duplicate Record Is Not Allowed", 1);
      return
    }

    if (this.editFlag) {
      this.data.getApprovalMaster.find((ele: any) => {
        formData.approvalLevels.map((item: any) => {
          if (item.approvalLevel == ele.approvalLevel) {
            item.id = ele.id
          }
        })
      })
    }

    let obj = {
      "schemeTypeId": formData.scheme,
      "departmentId": formData.department,
      "stateId": formData.state,
      "districtId": formData.district,
      "createdBy": this.WebStorageService.getUserId(),
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  //#endregion--------------------------------------------------------- Add Level drop fn end heare--------------------------------------------//
 
}


