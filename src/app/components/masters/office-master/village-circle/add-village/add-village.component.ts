import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from 'src/app/core/services/master.service';
import { VillageCircleComponent } from '../village-circle.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-village',
  templateUrl: './add-village.component.html',
  styleUrls: ['./add-village.component.scss']
})
export class AddVillageComponent implements OnDestroy {
  villageForm!: FormGroup;
  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  grampanchayatArray = new Array();
  @ViewChild('formDirective') private formDirective!: NgForm;
  subscription!: Subscription;
  lang: any;
  isViewFlag: boolean = false;
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();
  constructor
    (
      private fb: FormBuilder,
      private master: MasterService,
      public dialogRef: MatDialogRef<VillageCircleComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private spinner: NgxSpinnerService,
      public WebStorageService: WebStorageService,
      private apiService: ApiService,
      private commonMethodService: CommonMethodsService,
      private errorService: ErrorHandlingService,
      public validator: ValidationService,
    ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.isViewFlag = this.data?.label == 'View' ? true : false;
    if (!this.isViewFlag) {
      this.getState();
    }
    this.getFormData();
    this.searchDataZone();
  }

  getFormData() {
    this.villageForm = this.fb.group({
      id: [this.data ? this.data?.id : 0],
      stateId: [this.data ? this.data?.stateId : this.WebStorageService.getStateId() == '' ? 0 : this.WebStorageService.getStateId()],
      districtId: [this.data ? this.data?.districtId :  this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],
      talukaId: [this.data ? this.data?.talukaId : '', [Validators.required]],
      grampanchayats: [this.data ? this.data?.grampanchayat : '',[Validators.required]],
      circleName: [this.data ? this.data?.circleName : '', [Validators.required, Validators.pattern(this.validator.fullName), this.validator.maxLengthValidator(30)]],
      m_CircleName: [this.data ? this.data?.m_CircleName : '', [Validators.required, Validators.pattern(this.validator.marathi), this.validator.maxLengthValidator(30)]],
      flag: [this.data ? "u" : "i"],
      createdBy: [this.WebStorageService.getUserId()]
    })
  }

  get f() { return this.villageForm.controls };

  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethodService.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.commonMethodService.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }

  getState() {
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
        this.data ? (this.f['stateId'].setValue(this.data?.stateId)) : '';
        this.getDisrict();
      }), error: (() => {
        this.stateArray = [];
      })
    })
  }

  getDisrict() {
    let stateId = this.villageForm.getRawValue()?.stateId;
    this.master.GetAllDistrict(stateId).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.districtArray.unshift({ "id": 0, "textEnglish": "All District", "textMarathi": "सर्व जिल्हे" });
        this.data ? this.f['districtId'].setValue(this.data?.districtId) : '';
        this.getTaluka();
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  getTaluka() {
    let stateId = this.villageForm.getRawValue().stateId;
    let distId = this.villageForm.getRawValue().districtId;
    this.master.GetAllTaluka(stateId, distId, 0,).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        this.commonMethodService.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
        this.data ? (this.f['talukaId'].setValue(this.data?.talukaId), this.getGrampanchayat(false)) : '';
      }), error: (() => {
        this.talukaArray = [];
      })
    })
  }

  getGrampanchayat(flag?:boolean) {
    let talukaId = this.villageForm.getRawValue().talukaId;
    this.master.GetGrampanchayat(talukaId || 0).subscribe({
      next: ((res: any) => {
        this.grampanchayatArray = res.responseData;
        this.commonMethodService.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
        if (this.data && !flag) {
          let newVillage = new Array();
          this.data?.grampanchayat.forEach((res: any) => {
            newVillage.push(res.id)
          });
          newVillage.forEach((n: any) => {
            this.grampanchayatArray.filter((g: any) => g.id == n ? g.isAssigned = true : g.isAssigned = g.isAssigned);
          })
          this.f['grampanchayats'].setValue(newVillage)
        }
      }), error: (() => {
        this.grampanchayatArray = [];
      })
    })
  }

  onSubmitData() {
    this.spinner.show();
    let formData = this.villageForm.getRawValue();
    formData.grampanchayats =  this.villageForm.value.grampanchayats.toString();
    if (this.villageForm.invalid ) {
      this.spinner.hide();
      return;
    } else {
      this.apiService.setHttp('post', 'sericulture/api/Circles/AddUpdateCircles?lan=' + this.lang, false, formData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.commonMethodService.snackBar(res.statusMessage, 0);
            this.spinner.hide();
            this.dialogRef.close('Yes');
            this.formDirective.resetForm();
          } else {
            this.spinner.hide();
            this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.spinner.hide();
          this.errorService.handelError(error.status);
        }
      })
    }
  }

  clearDropDown(flag?: any) {    
    if (flag == 'village') {
      this.f['grampanchayats'].setValue('');
      this.grampanchayatArray = [];
    }
  }

  clearFormData() {
    this.formDirective.resetForm();
    this.data = null;
    this.getFormData();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.talukaSubject.unsubscribe();
    this.gramPSubject.unsubscribe();

  }



}
