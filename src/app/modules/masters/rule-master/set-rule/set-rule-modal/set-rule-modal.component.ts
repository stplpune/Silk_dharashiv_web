import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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

  setRulefrm: FormGroup | any;
  stateArray = new Array();
  districtrArray = new Array();
  schemeTypeArray = new Array();
  departmentArray: any;
  designationLevelArray = new Array();
  designationArray = new Array();
  subscription!: Subscription;//used  for lang conv
  @ViewChild('formDirective') private formDirective!: NgForm;
  lang: any;
  isViewFlag: boolean = false;
  editFlag: boolean = false;
  displayedColumns: string[] = ['Sr.No', 'Order', 'Action', 'Designation Level', 'Designation'];
  tableData = new Array();
  getAllActionArray: any;

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
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.filterFrom();
    });
    this.isViewFlag = this.data?.label == 'View' ? true : false;
    this.filterFrom(); this.addRuleForm();
    this.getState();
    this.getDisrict();
    this.getSchemeType();
    this.getDesignationLevel();
    this.approveLevelArray = new MatTableDataSource();
    this.data?.label == 'Edit' ? this.editData() : '';
    this.tableData = this.data?.getApprovalMaster;
  }

  //#region ------------------------------------------------------filter drop fn start heare--------------------------------------------//

  get f() { return this.setRulefrm.controls }

  filterFrom() {
    this.setRulefrm = this.fb.group({
      scheme: ['', [Validators.required]],
      department: ['', [Validators.required]],
      state: [this.apiService.stateId, [Validators.required]],
      district: [this.apiService.disId, [Validators.required]],
      approvalLevels: this.fb.array([])
    })
  }

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
    this.master.GetDepartmentDropdownNew().subscribe({
      next: ((res: any) => {
        this.departmentArray = res.responseData;
      }), error: (() => {
        this.departmentArray = [];
      })
    })
  }

  getAllAction() {
    // this.setRulefrm.controls['approvalLevels'].reset();
    // this.formArrayClear();
    let formData = this.setRulefrm.getRawValue();
    let obj = + formData.state + '&DistrictId=' + formData.district + '&SchemeId=' + formData.scheme + '&DepartmentId=' + (formData.department || 0) + '&lan=' + this.lang
    this.apiService.setHttp('GET', 'sericulture/api/Action/get-All-Action?StateId=' + obj, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.getAllActionArray = res.responseData;
        } else { this.getAllActionArray = [] }
      }, error: (err: any) => { this.error.handelError(err.status) },
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
    this.master.GetDesignationDropDown(this.f['department'].getRawValue(), this.g['departmentLevelId'].getRawValue()).subscribe({
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
    this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetAllApprovalMasterLevels?pageno=1&pagesize=1000' + '&SchemeTypeId='
      + (formData.scheme) + '&DepartmentId=' + (formData.department || 0) + '&StateId=' + (formData.state || 1) + '&DistrictId=' + (formData.district || 1) + '&lan=' + this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.data = res.responseData[0];
          this.editData();
        } else {
          this.editFlag = false;
          // this.getDesignation();
          this.getAllAction();
        }
      }, error: (err: any) => { this.error.handelError(err.status) },
    });
  }

  //.............................................  Inside Form Code Start Here ...........................................//

  AddRulefrm: FormGroup | any;
  @ViewChild('addRuleformDirective') private addRuleformDirective!: NgForm;
  approveLevelArray: any = new Array();
  addRuledisplayedColumns: string[] = ['Sr.No', 'Order', 'Action', 'Designation Level', 'Designation', 'edit'];
  addRuleEditFlag: boolean = false;

  get g() { return this.AddRulefrm.controls }

  addRuleForm() {
    this.AddRulefrm = this.fb.group({
      id: [0],
      approvalLevel: ['', [Validators.required]],
      actionId: ['', [Validators.required]],
      departmentLevelId: ['', [Validators.required]],
      designationId: ['', [Validators.required]],
    })
  }

  setActionDropdown() { // get Action Id
    let actionId = this.getAllActionArray.find((ele: any) => this.g['approvalLevel'].getRawValue() == ele?.orderLevel).id;
    this.g['actionId'].setValue(actionId);
  }

  addRule() {
    if (this.AddRulefrm.invalid) {
      return;
    }
    if (this.addRuleEditFlag == false && this.approveLevelArray?.filteredData?.some((ele: any) => (this.g['actionId'].getRawValue() == ele?.actionId))) {
      this.commonMethods.snackBar('Dublicate Record Not Accept', 1);
    } else {
      let arformData = this.AddRulefrm.getRawValue();
      this.approveLevelArray.filteredData?.length ? '' : this.approveLevelArray.filteredData = [];
      let level_Action = this.getAllActionArray.find((ele: any) => arformData.approvalLevel == ele.orderLevel);
      let designLevel = this.designationLevelArray.find((ele: any) => arformData.departmentLevelId == ele.id);
      let design = this.designationArray.find((ele: any) => arformData.designationId == ele.id);

      let obj = {
        id: arformData.id,
        orderLevel: arformData.approvalLevel, // id
        approvalLevel: level_Action?.approvalLevel,
        m_approvalLevel: level_Action?.m_ApprovalLevel,
        actionId: arformData.actionId,
        actionName: level_Action?.actionName,
        m_ActionName: level_Action?.m_ActionName,
        departmentLevelId: arformData.departmentLevelId,
        departmentLevel: designLevel?.textEnglish,
        m_DepartmentLevel: designLevel?.textMarathi,
        designationId: arformData.designationId,
        designationName: design?.textEnglish,
        m_designationName: design?.textMarathi,
      }

      if (this.addRuleEditFlag == true) {
        this.approveLevelArray.filteredData = this.approveLevelArray.filteredData.map((ele: any) => {
          ele.orderLevel == arformData.approvalLevel ? ele = obj : '';
          return ele;
        })
      } else {
        this.approveLevelArray.filteredData.push(obj);
      }

      console.log(this.approveLevelArray.filteredData);

      this.approveLevelArray = new MatTableDataSource(this.approveLevelArray?.filteredData);
      this.clearAddRuleForm();
    }
  }

  editAddRule(obj: any) {
    this.addRuleEditFlag = true;
    this.AddRulefrm.patchValue({
      id: obj.id,
      approvalLevel: obj.orderLevel,
      actionId: obj.actionId,
      departmentLevelId: obj.departmentLevelId,
      designationId: obj.designationId,
    });
    this.getDesignation();
  }

  clearAddRuleForm() {
    this.addRuleformDirective?.resetForm();
    this.addRuleForm();
    this.addRuleEditFlag = false;
  }

  //.............................................  Inside Form Code eND Here ...........................................//

  editData() {
    this.editFlag = true;
    this.setRulefrm.patchValue({
      state: this.data.stateId,
      district: this.data.districtId,
      scheme: this.data.schemeTypeId,
      department: this.data.departmentId,
    });

    this.getDepartment(); // when Scheme selected
    let orderActionArray: any[] = []; // only For Order Action | Dropdown required Field

    this.approveLevelArray.filteredData = [];
    this.data?.getApprovalMaster.forEach((x: any) => {
      this.approveLevelArray?.filteredData?.push({
        id: x?.id,
        orderLevel: x?.orderLevel, // id
        approvalLevel: x?.approvalLevel,
        m_approvalLevel: x?.m_ApprovalLevel,
        actionId: x?.actionId,
        actionName: x?.actionName,
        m_ActionName: x?.m_ActionName,
        departmentLevelId: x?.departmentLevelId,
        departmentLevel: x?.departmentLevel,
        m_DepartmentLevel: x?.m_DepartmentLevel,
        designationId: x?.designationId,
        designationName: x?.designationName,
        m_designationName: x?.m_DesignationName,
      });

      orderActionArray?.push({
        "id": x?.actionId, "actionName": x?.actionName, "m_ActionName": x?.m_ActionName,
        "orderLevel": x?.orderLevel, "approvalLevel": x?.approvalLevel, "m_ApprovalLevel": x?.m_ApprovalLevel,
      })
    });
    this.getAllActionArray = orderActionArray;
    this.approveLevelArray = new MatTableDataSource(this.approveLevelArray?.filteredData);
  }

  onSubmit() {
    if (this.setRulefrm.invalid) {
      return;
    }
    if (this.getAllActionArray?.length != this.approveLevelArray?.filteredData?.length) {
      this.commonMethods.snackBar('All Order Level is Required', 1);
      return;
    }
    this.spinner.show();
    let formData = this.setRulefrm.getRawValue();

    let approvalLevelsArray: any[] = [];
    this.approveLevelArray?.filteredData.map((ele: any) => {
      let res = {
        id: ele?.id,
        approvalLevel: ele?.orderLevel,
        actionId: ele?.actionId,
        departmentLevelId: ele?.departmentLevelId, // ele?.departmentLevelId is a Designation Level Id
        designationId: ele?.designationId,
      }
      approvalLevelsArray?.push(res);
    })

    let obj = {
      "schemeTypeId": formData.scheme,
      "departmentId": formData.department || 0,
      "stateId": formData.state,
      "districtId": formData.district,
      "createdBy": this.WebStorageService.getUserId(),
      "approvalLevels": approvalLevelsArray
    }
    this.apiService.setHttp('post', 'sericulture/api/ApprovalMaster/AddUpdateApprovalMasterLevels', false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.clearForm();
          this.dialogRef.close('Yes');
        } else {
          this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => { this.spinner.hide(); this.error.handelError(error.statusCode) }
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


