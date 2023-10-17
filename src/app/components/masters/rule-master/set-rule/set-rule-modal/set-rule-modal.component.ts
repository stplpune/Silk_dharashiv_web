import { Component, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
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
  Duplicate: any;
  @ViewChild('formDirective') private formDirective!: NgForm;
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
      debugger
      if (this.approvallistForm.length > 1) {
        this.Duplicate = this.approvallistForm.controls.some((control: any) => {
          console.log(control)
          // if (this.approvallistForm.length > 1 && ) {
          //   this.commonMethods.snackBar("This Record Already Exists Please Select Another Value", 1);
          //   // control.get("approvalLevel")[i].setValue(0);
          //   return true
          // } else
          if (control.value.approvalLevel == this.orderId && control.value.actionId == this.aId && control.value.departmentLevelId == this.deptlevelID && control.value.designationId == this.designationID) {
            this.commonMethods.snackBar("This Record already exists.", 1);
            return
          }
          else {
            return false
          }
          // else if (this.approvallistForm.length > 1 && control.value.departmentLevelId == this.deptlevelID) {
          //   this.commonMethods.snackBar("This dept level already exists.", 1);
          //   return true
          // } else if (this.approvallistForm.length > 1 && control.value.designationId == this.designationID) {
          //   this.commonMethods.snackBar("This designation already exists.", 1);
          //   return true;
          // }

          // control.value.actionId == this.aId &&
          //   control.value.departmentLevelId === data.value.departmentLevelId &&
          //   control.value.designationId === data.value.designationId &&
          //   control.value.approvalLevel === data.value.approvalLevel
        });

      }

      if (this.Duplicate == true) {
        return
      }
      else {
        this.approvallistForm.push(data);
      }


      // if (isDuplicate == true) {
      //   console.log("isDuplicate",isDuplicate);

      //   // this.commonMethods.snackBar("This record already exists.", 1);
      //   return;
      // }
      // else {
      //   this.approvallistForm.push(data);
      //   console.log("Array ......", this.approvallistForm.value);

      // }
    }
  }

  clearFormArray() {
    if (this.editFlag == true) {
      this.approvallistForm.clear()
    }
  }

  editData() {
    this.editFlag = true;
    this.editId = this.data.id;
    console.log(this.editId);
    console.log(this.data);


    this.setRulefrm.patchValue({
      scheme: this.data.schemeTypeId,
      department: this.data.departmentId,
      state: this.data.stateId,
      district: this.data.districtId,
      approvalLevels: this.data.id
    });

    console.log(this.data.getApprovalMaster);
    this.clearFormArray();

    (this.data?.getApprovalMaster as Array<any>).forEach((x: any) => {
      this.approvallistForm.push(this.fb.group(
        {
          id: [x?.id],
          actionId: [x?.actionId],
          departmentLevelId: [x?.departmentLevelId],
          designationId: [x?.designationId],
          approvalLevel: [x?.approvalLevel],
        }
      ));
    });


  }

  onSubmit() {
    let formData = this.setRulefrm.value;
    if (this.setRulefrm.invalid) { return; }
    let obj = {
      "schemeTypeId": formData.scheme,
      "departmentId": formData.department,
      "stateId": formData.state,
      "districtId": formData.district,
      "createdBy": this.WebStorageService.getUserId(),
      "flag": this.editFlag ? this.editId : 0,
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
    this.setRulefrm.controls['state'].setValue(1);
    this.setRulefrm.controls['district'].setValue(1);
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

