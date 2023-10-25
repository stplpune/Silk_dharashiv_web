import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-grainage',
  templateUrl: './add-grainage.component.html',
  styleUrls: ['./add-grainage.component.scss']
})
export class AddGrainageComponent {
  grainageFrm!: FormGroup;
  grainageArr = new Array();
  stateArr  = new Array();
  districtArr  = new Array();
  talukaArr  = new Array();
  @ViewChild('formDirective') private formDirective!: NgForm;
  get f() { return this.grainageFrm.controls };
  subscription!: Subscription;
  lang: string = 'English';
  isViewFlag: boolean = false;

  constructor(private fb: FormBuilder,
    private master: MasterService,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public dialog: MatDialog,
    public webStorage: WebStorageService,
    public dialogRef: MatDialogRef<AddGrainageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.isViewFlag = this.data?.label == 'View' ? true : false; //for View Functionality
    if (!this.isViewFlag) {
      this.getGrainage();this.getState();
    }
    this.defaultFrm();
  }

  defaultFrm() {
    this.grainageFrm = this.fb.group({
      id: [this.data ? this.data.id : 0],
      type: [this.data ? this.data.type : '',[Validators.required]],
      grainage: [this.data ? this.data.grainage : '',[Validators.required]],
      m_Grainage: [this.data ? this.data.m_Grainage : '',[Validators.required]],
      stateId: [this.data ? this.data.stateId : this.webStorage.getStateId() == '' ? 0 : this.webStorage.getStateId()],
      districtId: [this.data ? this.data.districtId : this.webStorage.getDistrictId() == '' ? 0 : this.webStorage.getDistrictId()],
      talukaId: [this.data ? this.data.talukaId : '',[Validators.required]],
      address: [this.data ? this.data.address : '',[Validators.required]],
      m_Address: [this.data ? this.data.m_Address : ''],
      pincode: [this.data ? this.data.pincode : '',[Validators.required]],
      remark: [this.data ? this.data.remark : ''],
      flag: [this.data ? "u" : "i"]
    })
  }

  getGrainage(){
    this.grainageArr = [];
    this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-Grainage-Type?lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.grainageArr = res.responseData;
          console.log('hg',this.data);
          
          this.data ? (this.f['type'].setValue(this.data?.type)) : '';
        } else {
          this.grainageArr = [];
        }
      }
    });
  }

  getState() {
    this.stateArr = [];
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArr = res.responseData;
        this.data ? (this.f['stateId'].setValue(this.webStorage.getStateId()), this.getDisrict()) : this.getDisrict();
      }), error: (() => {
        this.stateArr = [];
      })
    })
  }


  getDisrict() {
    this.districtArr = [];
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArr = res.responseData;
        this.data ? (this.f['districtId'].setValue(this.webStorage.getDistrictId()), this.getTaluka()) : this.getTaluka();
      }), error: (() => {
        this.districtArr = [];
      })
    })
  }


  getTaluka() {
    let stateId = this.grainageFrm.getRawValue().stateId;
    let distId = this.grainageFrm.getRawValue().districtId;
    this.master.GetAllTaluka(stateId, distId, 0,).subscribe({
      next: ((res: any) => {
        this.talukaArr = res.responseData;
        this.data ? (this.f['talukaId'].setValue(this.data?.talukaId)) : '';
      }), error: (() => {
        this.talukaArr = [];
      })
    })
  }


  onSubmitData() {
    let formvalue = this.grainageFrm.getRawValue();
    if (this.grainageFrm.invalid) {
      return
    } else {
      this.spinner.show();
      formvalue.id = Number(formvalue.id)
      let mainData = {...formvalue,"createdBy":this.webStorage.getUserId()};
      this.apiService.setHttp('POST', 'sericulture/api/GrainageModel/Insert-Update-Grainage?lan='+this.lang, false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
             this.common.snackBar(res.statusMessage, 0);  
             this.dialogRef.close('Yes');
          } else {
            this.spinner.hide();
            this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
          }
        }),
        error: ((error: any) => {
          this.spinner.hide()
          this.errorService.handelError(error.status)
        })
      })
    }
  }
  
  clearFormData() { // for clear Form field
    this.formDirective?.resetForm();
    this.data = null;
    this.defaultFrm();
  }

}
