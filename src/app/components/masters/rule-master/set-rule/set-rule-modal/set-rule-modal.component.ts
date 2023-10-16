import { Component, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  approveLevelResp = new Array();
  editFlag: boolean = false;
  editId: any;
  aId: any;
  deptlevelID: any;
  designationID: any;
  orderId: any;
  @ViewChild('formDirective') private formDirective!: NgForm;
  constructor(private fb: FormBuilder,
    private master: MasterService,
    private commonMethods: CommonMethodsService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private error: ErrorHandlingService,
    public dialogRef: MatDialogRef<SetRuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log(this.data);

    this.defaultFrom();
    this.getSchemeType();
    this.getDepartment();
    this.getState();
    this.getDisrict();
    this.getAction();
    this.getLevel();
    this.getDesignation();
    this.getLevelApprovel();
    // this.addList();
    this.data?.label == 'Edit' ? this.editData() : '';
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

  get f() {
    return this.setRulefrm.controls;
  }
  get g() {
    return this.setRulefrm.controls['approvalLevels'].value;
  }
  get approvallistForm() { return this.setRulefrm.get('approvalLevels') as FormArray }

  addList() {
    if (this.approvallistForm.length && this.approvallistForm.status == 'INVALID') {
      this.commonMethods.snackBar("Please Add Approval Details First", 1);
      return;
    }
    else {
      const data = this.fb.group({
        "actionId": ['', [Validators.required]],
        "departmentLevelId": ['', [Validators.required]],
        "designationId": ['', [Validators.required]],
        "approvalLevel": ['', [Validators.required]]
      })
      let levelData = this.setRulefrm.controls['approvalLevels'].value;

      levelData.map((x: any) => {
        this.aId = x.actionId;
      })

      levelData.map((x: any) => {
        this.deptlevelID = x.departmentLevelId;
      })

      levelData.map((x: any) => {
        this.designationID = x.designationId;
      })

      levelData.map((x: any) => {
        this.orderId = x.approvalLevel;
      })

      const isDuplicate = this.approvallistForm.controls.some((control: any, i: any) => {
        console.log(control)
        if (this.approvallistForm.length > 1 && control.value.approvalLevel == this.orderId) {
          this.commonMethods.snackBar("This Record Already Exists Please Select Another Value", 1);
          control.get("approvalLevel")[i]?.setValue("");
          return true
        } else if (this.approvallistForm.length > 1 && control.value.actionId == this.aId && control.value.departmentLevelId == this.deptlevelID && control.value.designationId == this.designationID) {
          this.commonMethods.snackBar("This Record already exists.", 1);
          return true
        }
        // else if (this.approvallistForm.length > 1 && control.value.departmentLevelId == this.deptlevelID) {
        //   this.commonMethods.snackBar("This dept level already exists.", 1);
        //   return true
        // } else if (this.approvallistForm.length > 1 && control.value.designationId == this.designationID) {
        //   this.commonMethods.snackBar("This designation already exists.", 1);
        //   return true;
        // }
        return false
        // control.value.actionId == this.aId &&
        //   control.value.departmentLevelId === data.value.departmentLevelId &&
        //   control.value.designationId === data.value.designationId &&
        //   control.value.approvalLevel === data.value.approvalLevel
      });


      if (isDuplicate) {
        // this.commonMethods.snackBar("This record already exists.", 1);
        return;
      }
      else {
        this.approvallistForm.push(data);
        console.log("Array ......", this.approvallistForm.value);


      }
    }
  }

  editData() {
    this.editFlag = true;
    this.editId = this.data.id;
    this.setRulefrm.patchValue({
      scheme: this.data.schemeTypeId,
      department: this.data.departmentId,
      state: this.data.stateId,
      district: this.data.districtId,
      approvalLevels: this.data.id
    })
  }

  onSubmit() {
    let formData = this.setRulefrm.value;
    if (this.setRulefrm.invalid) { return; }
    let obj = {
      "schemeTypeId": formData.scheme,
      "departmentId": formData.department,
      "stateId": formData.state,
      "districtId": formData.district,
      "createdBy": 0,
      "flag": this.editFlag == true ? 'u' : 'i',
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

  deleteApproveLevel(i: any) {
    this.approvallistForm.removeAt(i);
  }
  //--------Dropdown Code Start Here---------------------
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

  getLevelApprovel() {
    this.master.GetLevelApproval().subscribe({
      next: ((res: any) => {
        this.approveLevelResp = res.responseData;
      }), error: (() => {
        this.approveLevelResp = [];
      })
    })
  }
  //-----------------------------Dropdown Code End Here---------------------- 

}

