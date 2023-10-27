import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { NgxSpinnerService } from 'ngx-spinner';
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
export class SetRuleModalComponent implements OnInit {

  setRulefrm: FormGroup | any;
  stateArray = new Array();
  districtArray = new Array();
  schemeTypeArray = new Array();
  departmentArray = new Array();
  actionArray = new Array();
  subscription!: Subscription;
  // @ViewChild('formDirective') private formDirective!: NgForm;
  lang: any;
  editFlag: boolean = false;
  isViewFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private master: MasterService,
    private commonMethods: CommonMethodsService,
    private apiService: ApiService,
    // private spinner: NgxSpinnerService,
    private error: ErrorHandlingService,
    private WebStorageService: WebStorageService,
    public dialogRef: MatDialogRef<SetRuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setRuleform();
    });
    this.isViewFlag = this.data?.label == 'View' ? true : false;

    this.setRuleform();
    this.getState();
    this.getDisrict();
    this.getSchemeType();
    this.getDepartment();
  }
  
  get f() { return this.setRulefrm.controls}

  setRuleform() {
    this.setRulefrm = this.fb.group({
      scheme: ['', [Validators.required]],
      department: ['', [Validators.required]],
      state: [this.apiService.stateId, [Validators.required]],
      district: [this.apiService.disId, [Validators.required]],
      aa: ['', [Validators.required]],
      approvalLevels: this.fb.array([])
    })
  }

  get g() { return this.setRulefrm.controls['approvalLevels'].value}
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
        this.districtArray = res.responseData;
      }), error: (() => {
        this.districtArray = [];
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

  getAllAction() {
    let formData = this.setRulefrm.getRawValue();
    let obj: any = formData.state + '&DistrictId=' + formData.district + '&SchemeId=' + formData.scheme + '&DepartmentId=' + formData.department + '&lan=' + this.lang
    this.apiService.setHttp('GET', "sericulture/api/Action/get-All-Action?StateId=" + obj, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.actionArray = res.responseData;
        } else { this.actionArray = [] }
      },
      error: ((err: any) => { this.commonMethods.checkDataType(err.statusText) == false ? this.error.handelError(err.statusCode) : this.commonMethods.snackBar(err.statusText, 1); })
    })
  }

  


}


