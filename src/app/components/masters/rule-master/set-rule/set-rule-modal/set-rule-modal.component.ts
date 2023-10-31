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
  departmentArray:any;
  designationLevelArray = new Array();
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
    this.getDesignationLevel();
    this.data?.label == 'Edit' ? this.editData() : '';
    this.tableData = this.data?.getApprovalMaster

  }

  //#region ------------------------------------------------------filter drop fn start heare--------------------------------------------//

  defaultFrom() {
    this.setRulefrm = this.fb.group({  
      scheme: ['', [Validators.required]],
      department: [''],
      state: [this.apiService.stateId, [Validators.required]],
      district: [this.apiService.disId, [Validators.required]],
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

  getDepartment(flag?:any) {   
    this.master.GetDepartmentDropdown(this.f['scheme'].getRawValue()).subscribe({
      next: ((res: any) => {
        this.departmentArray = res.responseData;
        this.f["department"].setValidators([Validators.required]); this.f["department"].updateValueAndValidity();
       }), error: (() => {
        this.departmentArray = [];
        this.f['department'].setValue(''); this.f['department'].clearValidators(); this.f['department'].updateValueAndValidity(); // when department Res Available
        flag == 'select' ? this.getAllApprovalMasterLevels() : '';
        // flag == 'select' ? this.getAllAction() : '';
      })
    })
  }

  getAllAction(){
    this.setRulefrm.controls['approvalLevels'].reset();
    const arr:any = this.setRulefrm.controls['approvalLevels'] as FormArray;
    if ( arr.length > 0 ){arr.clear();}
      let formData = this.setRulefrm.getRawValue();
      let obj= + formData.state + '&DistrictId=' + formData.district + '&SchemeId=' + formData.scheme + '&DepartmentId=' + (formData.department || 0) + '&lan=' + this.lang
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
          actionId: [ele.id , [Validators.required]],
          departmentLevelId: ['', [Validators.required]],
          designationId: ['', [Validators.required]],
        }))
    });
  }

  getDesignationLevel() {  // Designation Level Api
    this.master.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        this.designationLevelArray = res.responseData;
        this.designationLevelArray.unshift({ id: 0, textEnglish: 'Select Designation Level', textMarathi: "पदनाम स्तर निवडा" })
      }), error: (() => {
        this.designationLevelArray = [];
      })
    })
  }

  getDesignation() {
    this.master.GetDesignationDropDown(this.f['department'].getRawValue() || 0).subscribe({
      next: ((res: any) => {
        this.designationArray = res.responseData;
        this.designationArray.unshift({ id: 0, textEnglish: 'Select Designation', textMarathi: "पदनाम निवडा" })
      }), error: (() => {
        this.designationArray = [];
      })
    })
  }

  getAllApprovalMasterLevels() { // check only for data available or not this is Table Api
    let formData = this.setRulefrm.getRawValue();
    this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetAllApprovalMasterLevels?pageno=1&pagesize=1000'+ '&SchemeTypeId=' 
    + (formData.scheme) + '&DepartmentId=' + (formData.department || 0) + '&StateId=' + (formData.state || 1) + '&DistrictId=' + (formData.district || 1) + '&lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          console.log('1');
          this.data = res.responseData[0];
          this.editData();
          // this.tableresp = res.responseData;
        } else {
          console.log('2');
          this.getDesignation();
          this.getAllAction();
        }
      },error: (err: any) => {this.error.handelError(err.status)},
    });
  }

  editData() {
    this.editFlag = true;
    this.setRulefrm.patchValue({
      state: this.data.stateId,
      district: this.data.districtId,
      scheme: this.data.schemeTypeId,
      department: this.data.departmentId,
    });

    this.getDepartment(); // when Scheme selected
    this.getDesignation();

    let orderActionArray:any[] = []; // only For Order Action | Dropdown required Field
    this.data?.getApprovalMaster.forEach((x: any) => {
      this.approvallistForm.push(this.fb.group(
        {
          id: [x?.id],
          approvalLevel: [x?.orderLevel],
          actionId: [x?.actionId],
          departmentLevelId: [x?.departmentLevelId], // x?.departmentLevelId is a Designation Level Id
          designationId: [x?.designationId],
        }
      ));

      orderActionArray.push({"id": x?.actionId,"actionName": x?.actionName,"m_ActionName": x?.m_ActionName,
        "orderLevel": x?.orderLevel,"approvalLevel": x?.approvalLevel,"m_ApprovalLevel": x?.m_ApprovalLevel,})
    });

    this.getAllActionArray = orderActionArray;
  }

  onSubmit() {
    if (this.setRulefrm.invalid || !this.approvallistForm.controls?.length) {
      return;
    }

    this.spinner.show();
    let formData = this.setRulefrm.getRawValue();

    let obj = {
      "schemeTypeId": formData.scheme,
      "departmentId": formData.department || 0,
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


