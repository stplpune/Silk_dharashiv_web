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
export class SetRuleModalComponent implements OnDestroy {

  setRulefrm!: FormGroup;
  stateArray = new Array();
  districtrArray = new Array();
  schemeTypeArray = new Array();
  departmentArray = new Array();

  actionArray = new Array();
  departmentLevelArray = new Array();
  designationArray = new Array();
  approveLevelArray = new Array();
  subscription!: Subscription;//used  for lang conv
  @ViewChild('formDirective') private formDirective!: NgForm;
  lang: any;
  isViewFlag: boolean = false;
  editFlag: boolean = false;
  displayedColumns: string[] = ['Sr.No', 'Order', 'Action', 'Designation Level', 'Designation'];
  tableData = new Array();
  getAllActionArray:any;
  orderLevelArray: any;

  constructor(
    private fb: FormBuilder,
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
    this.getState();
    this.getDisrict();
    this.getSchemeType();
    this.getDepartment();
    this.getAction();
    this.getOrder_Level();
    this.getDepartmentLevel();
    // this.getDesignation();
    // this.getLevelApprovel();
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
 
  getState() {
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
      }), error: (() => {
        this.stateArray = [];
      })
    })
  }

  getDisrict() {
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtrArray = res.responseData;
      }), error: (() => {
        this.districtrArray = [];
      })
    })
  }

  getSchemeType() {
    this.master.GetAllSchemeType().subscribe({
      next: ((res: any) => {
        this.schemeTypeArray = res.responseData;
      }), error: (() => {
        this.schemeTypeArray = [];
      })
    })
  }

  getDepartment() {
    this.master.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        this.departmentArray = res.responseData;
      }), error: (() => {
        this.departmentArray = [];
      })
    })
  }

  getAllAction(){
    this.setRulefrm.controls['approvalLevels'].reset();
    const arr:any = this.setRulefrm.controls['approvalLevels'] as FormArray;
    if ( arr.length > 0 ){arr.clear();}
   
      let formData = this.setRulefrm.getRawValue();
      let obj= + formData.state + '&DistrictId=' + formData.district + '&SchemeId=' + formData.scheme + '&DepartmentId=' + formData.department + '&lan=' + this.lang
      this.apiService.setHttp('GET', 'sericulture/api/Action/get-All-Action?StateId=' + obj, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.getAllActionArray = res.responseData;
            this.addDataToFormArray();
          } else {this.getAllActionArray = []}
        },error: (err: any) => {this.error.handelError(err.status)},
      });
    }

  addDataToFormArray() {
    this.getAllActionArray.find((ele: any) => {
      this.approvallistForm.push(this.fb.group(
        {
          id: [0],
          approvalLevel: [ele.orderLevel, [Validators.required]],
          actionId: [this.actionArray.find((ele1: any) => (ele.actionName == ele1.textEnglish))?.id || '', [Validators.required]],
          departmentLevelId: ['', [Validators.required]],
          designationId: ['', [Validators.required]],
        }))
    });
  }
    
  checkDublicate(index: any,flag:any) {
    let selectedObj: any = this.approvallistForm.getRawValue()[index];

    let checkValueAvailable = this.approvallistForm.getRawValue().filter((ele: any) =>
      ((selectedObj.departmentLevelId === ele?.departmentLevelId) && (selectedObj.designationId === ele?.designationId))
    )

    if (checkValueAvailable?.length > 1) {
     flag == 'departmentLevel' ? this.approvallistForm.controls[index].controls['departmentLevelId'].setValue('') :
     this.approvallistForm.controls[index].controls['designationId'].setValue('');
     this.commonMethods.snackBar("Duplicate Record Not Allowed", 1);
    }
  }

  //#endregion ------------------------------------------------------filter drop fn end heare--------------------------------------------//

  //#region ---------------------------------------------------------Add Level drop fn start heare--------------------------------------------//
  
  getOrder_Level() {// ApprovalLevel
    this.master.getOrderLevel(this.lang).subscribe({ 
      next: ((res: any) => {
        this.orderLevelArray = res.responseData;
        // this.actionArray.unshift({ id: 0, textEnglish: 'Select Order Level', textMarathi: "कृती निवडा" })
      }), error: (() => {
        this.orderLevelArray = [];
      })
    })
  }

  getAction() {
    this.master.GetActionDropDown().subscribe({
      next: ((res: any) => {
        this.actionArray = res.responseData;
        // this.actionArray.unshift({ id: 0, textEnglish: 'Select Action', textMarathi: "कृती निवडा" })
      }), error: (() => {
        this.actionArray = [];
      })
    })
  }

  getDepartmentLevel() {
    this.master.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        this.departmentLevelArray = res.responseData;
        this.departmentLevelArray.unshift({ id: 0, textEnglish: 'Select Department Level', textMarathi: "पदनाम स्तर निवडा" })
      }), error: (() => {
        this.departmentLevelArray = [];
      })
    })
  }

  getDesignation() {
    this.master.GetDesignationDropDown(this.f['department'].getRawValue()).subscribe({
      next: ((res: any) => {
        this.designationArray = res.responseData;
        this.designationArray.unshift({ id: 0, textEnglish: 'Select Designation', textMarathi: "पदनाम निवडा" })
      }), error: (() => {
        this.designationArray = [];
      })
    })
  }

  // getLevelApprovel() {
  //   this.master.GetLevelApproval().subscribe({
  //     next: ((res: any) => {
  //       this.approveLevelArray = res.responseData;
  //       this.approveLevelArray.map((ele: any) => { ele['selected'] = false })
  //       this.approveLevelArray.unshift({ id: 0, textEnglish: 'Select Order', textMarathi: "ऑर्डर निवडा" })
  //     }), error: (() => {
  //       this.approveLevelArray = [];
  //     })
  //   })
  // }

  // checkPrevData() {
  //   let formData = this.setRulefrm.getRawValue();

  //   if (formData.scheme == '') {
  //     this.commonMethods.snackBar("Please select scheme name", 1);
  //     return
  //   } else if (formData.department == '') {
  //     this.commonMethods.snackBar("Please select department name", 1);
  //     return
  //   } else if (this.setRulefrm.invalid) {
  //     return
  //   }

  //   else {
  //     this.spinner.show();
  //     let formData = this.setRulefrm.getRawValue();
  //     this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetAllApprovalMasterLevels?pageno=1&pagesize=10&SchemeTypeId=' + (formData.scheme || 0) + '&DepartmentId=' + (formData.department || 0) + '&StateId=' + (formData.state || 1) + '&DistrictId=' + (formData.district || 1) + '&lan=1', false, false, false, 'masterUrl');
  //     this.apiService.getHttp().subscribe({
  //       next: (res: any) => {
  //         this.spinner.hide();
  //         if (res.statusCode == '200' && res.responseData.length) {
  //           this.data = res.responseData[0];
  //           this.data.label = 'Edit';
  //           this.data?.label == 'Edit' ? this.editData() : ''
  //         } else {
  //           this.addList();
  //         }
  //       },
  //       error: (err: any) => {
  //         this.spinner.hide();
  //         this.error.handelError(err.status);
  //       },
  //     });
  //   }
  // }

  // addList() {
  //   if (this.setRulefrm.invalid && this.approvallistForm.length && this.approvallistForm.status == 'INVALID') {
  //     this.commonMethods.snackBar("Please Add Approval Details First", 1);
  //   }
  //   else {
  //     const data: any = this.fb.group({
  //       "actionId": ['', [Validators.required]],
  //       "departmentLevelId": ['', [Validators.required]],
  //       "designationId": ['', [Validators.required]],
  //       "approvalLevel": ['', [Validators.required]],
  //       "disabled": [false]
  //     });
  //     if (this.approvallistForm.length > 1) {
  //       let approvallistForm = this.approvallistForm.getRawValue();
  //       console.log(approvallistForm);

  //       let len = this.approvallistForm.length - 2;
  //       for (let i = 0; i <= len; i++) {
  //         if ((approvallistForm[i]?.approvalLevel == approvallistForm[approvallistForm.length - 1]?.approvalLevel)) {
  //           this.commonMethods.snackBar("Duplicate Order level is not allowed", 1);
  //           return
  //         } else if ((approvallistForm[i]?.actionId == approvallistForm[approvallistForm.length - 1]?.actionId)) {
  //           this.commonMethods.snackBar("Duplicate Action is not allowed", 1);
  //           return
  //         }
  //         else if ((approvallistForm[i]?.actionId == approvallistForm[approvallistForm.length - 1]?.actionId) &&
  //           approvallistForm[i]?.departmentLevelId == approvallistForm[approvallistForm.length - 1]?.departmentLevelId && (approvallistForm[i]?.designationId == approvallistForm[approvallistForm.length - 1]?.designationId)) {
  //           this.commonMethods.snackBar("Duplicate Record Not Allowed", 1);
  //           return
  //         }
  //       }
  //       (this.approveLevelArray.length - 1) == approvallistForm.length ? this.commonMethods.snackBar("Exceed Limit", 1) : this.approvallistForm.push(data)
  //       this.approvallistForm.controls[approvallistForm.length - 1].controls['disabled']?.setValue(true);
  //     } else {
  //       this.approvallistForm.push(data);
  //       this.approvallistForm.length == 2 ? this.approvallistForm.controls[0].controls['disabled'].setValue(true) : '';
  //     }
  //   }
  // }

  selectRow(_event: any, _index: any) {
    // console.log(_event);
    // console.log(_index);
  }

  editData() {
    this.editFlag = true;
    this.setRulefrm.patchValue({
      state: this.data.stateId,
      district: this.data.districtId,
      scheme: this.data.schemeTypeId,
      department: this.data.departmentId,
      // approvalLevels: this.data.id
    });
    this.getDesignation();

    this.data?.getApprovalMaster.forEach((x: any) => {
      this.approvallistForm.push(this.fb.group(
        {
          id: [x?.id],
          approvalLevel: [x?.approvalLevel],
          actionId: [x?.actionId],
          departmentLevelId: [x?.departmentLevelId],
          designationId: [x?.designationId],
        }
      ));
    });
  }

  onSubmit() {
    if (this.setRulefrm.invalid || !this.approvallistForm.controls?.length) {
      return;
    }

    this.spinner.show();
    let formData = this.setRulefrm.getRawValue();

    // if (this.editFlag) {
    //   this.data.getApprovalMaster.find((ele: any) => {
    //     formData.approvalLevels.map((item: any) => {
    //       if (item.approvalLevel == ele.approvalLevel) {
    //         item.id = ele.id
    //       }
    //     })
    //   })
    // }

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


