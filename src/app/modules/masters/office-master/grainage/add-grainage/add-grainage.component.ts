import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subscription } from 'rxjs';
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
  grampanchayatArr = new Array();
  @ViewChild('formDirective') private formDirective!: NgForm;
  get f() { return this.grainageFrm.controls };
  subscription!: Subscription;
  lang: string = 'English';
  isViewFlag: boolean = false;
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();

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
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.isViewFlag = this.data?.label == 'View' ? true : false; //for View Functionality
    if (!this.isViewFlag) {
      this.getGrainage();this.getState();
    }
    this.defaultFrm();
    this.searchDataZone();
  }

  defaultFrm() {
    this.grainageFrm = this.fb.group({
      id: [this.data ? this.data.id : 0],
      type: [this.data ? this.data.type : '',[Validators.required]],
      grainage: [this.data ? this.data.grainage : '',[Validators.required,Validators.pattern(this.validator.englishNumericAndspecialChar), this.validator.maxLengthValidator(50)]],
      m_Grainage: [this.data ? this.data.m_Grainage : '',[Validators.required,Validators.pattern(this.validator.marathiNumericAndspecialChar), this.validator.maxLengthValidator(50)]],
      // stateId: [this.data ? this.data.stateId : this.webStorage.getStateId() == '' ? 0 : this.webStorage.getStateId()],
      stateId: [this.data ? this.data.stateId :'' ,[Validators.required]],
      // districtId: [this.data ? this.data.districtId : this.webStorage.getDistrictId() == '' ? 0 : this.webStorage.getDistrictId()],
      districtId: [this.data ? this.data.districtId : '' ,[Validators.required]],
      talukaId: [this.data ? this.data.talukaId : '',[Validators.required]],
      grampanchyatId : [this.data ? this.data.grampanchyatId : ''],
      //grampanchyatId : [this.data ? this.data.grampanchyatId : '',[Validators.required]],
      address: [this.data ? this.data.address : '',[Validators.required, this.validator.maxLengthValidator(150)]],
      pincode: [this.data ? this.data.pincode : '',[Validators.required,Validators.pattern(this.validator.valPinCode)]],
      remark: [this.data ? this.data.remark : ''],
      flag: [this.data ? "u" : "i"]
    })
  }

  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.common.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.common.filterArrayDataZone(this.grampanchayatArr, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }

  getGrainage(){
    this.grainageArr = [];
    this.master.GetGrainageType().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.grainageArr = res.responseData;
          this.data ? (this.f['type'].setValue(this.data?.typeId)) : '';
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
        this.data ? (this.f['stateId'].setValue(this.data?.stateId)) : '';
        this.getDisrict();
      }), error: (() => {
        this.stateArr = [];
      })
    })
  }


  getDisrict() {
    this.districtArr = [];
    let stateId = this.grainageFrm.getRawValue().stateId || 0;
    if(stateId!=0){
      this.master.GetAllDistrict(stateId).subscribe({
        next: ((res: any) => {
          this.districtArr = res.responseData;
          this.data ? (this.f['districtId'].setValue(this.data?.districtId)) : '';
          this.getTaluka();
        }), error: (() => {
          this.districtArr = [];
        })
      })
    }
  }


  getTaluka() {
    this.talukaArr =[];
    let stateId = this.grainageFrm.getRawValue().stateId || 0;
    let distId = this.grainageFrm.getRawValue().districtId || 0;
    if(stateId !=0 && distId !=0){
      this.master.GetAllTaluka(stateId, distId, 0,).subscribe({
        next: ((res: any) => {
          this.talukaArr = res.responseData;
          this.common.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
          this.data ? (this.f['talukaId'].setValue(this.data?.talukaId),this.getGrampanchayat()) : this.getGrampanchayat();
        }), error: (() => {
          this.talukaArr = [];
          this.talukaSubject.next(null);
        })
      })
    }
  }

  getGrampanchayat() {
    this.grampanchayatArr = [];
    let talukaId = this.grainageFrm.getRawValue().talukaId;
    if (talukaId != 0) {
      this.master.GetGrampanchayat(talukaId).subscribe({
        next: ((res: any) => {
          this.grampanchayatArr = res.responseData;
          this.common.filterArrayDataZone(this.grampanchayatArr, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
          this.data ? this.f['grampanchyatId'].setValue(this.data?.grampanchyatId) : '';
        }), error: (() => {
          this.grampanchayatArr = [];
          this.gramPSubject.next(null);
        })
      })
    }
  }



  onSubmitData() {
    let formvalue = this.grainageFrm.getRawValue();
    if (this.grainageFrm.invalid) {
      return;
    } else {
      this.spinner.show();
      formvalue.id = Number(formvalue.id)
      let mainData = {...formvalue,"createdBy":this.webStorage.getUserId()};
      this.apiService.setHttp('POST', 'sericulture/api/GrainageModel/Insert-Update-Grainage?lan='+this.lang, false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == '200') {
             this.common.snackBar(res.statusMessage, 0);  
             this.dialogRef.close('Yes');
          } else {
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

  clearDropdown(dropdown: string) {
    if (dropdown == 'state') {
      this.talukaSubject = new ReplaySubject<any>();
      this.f['districtId'].setValue('');
      this.districtArr = [];
      this.f['talukaId'].setValue('')
    }else if (dropdown == 'district') {
      this.talukaSubject = new ReplaySubject<any>();
      this.f['talukaId'].setValue('');
      this.gramPSubject = new ReplaySubject<any>();
      this.f['grampanchyatId'].setValue('');
    }else if(dropdown == 'taluka'){
      this.gramPSubject = new ReplaySubject<any>();
      this.f['grampanchyatId'].setValue('');
    }

  }
  
  clearFormData() { // for clear Form field
    this.formDirective?.resetForm();
    this.data = null;
    this.defaultFrm();
    this.districtArr = [];
    this.talukaSubject = new ReplaySubject<any>();
  }
  
  ngOnDestroy() {
    this.talukaSubject.unsubscribe();
  }

}
