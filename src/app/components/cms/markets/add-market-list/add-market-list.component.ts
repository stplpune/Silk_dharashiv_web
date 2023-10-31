import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { DateAdapter } from '@angular/material/core';
@Component({
  selector: 'app-add-market-list',
  templateUrl: './add-market-list.component.html',
  styleUrls: ['./add-market-list.component.scss']
})
export class AddMarketListComponent {
  marketFrm !: FormGroup;
  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  farmGoodsArray = new Array();
  subscription!: Subscription;//used  for lang conv
  lang: any;
  sendFarmDataArray = new Array();
  editFlag: boolean = false;
  editObj?: any;
  maxDate = new Date();
  isViewFlag: boolean = false;
  @ViewChild('formDirective') private formDirective!: NgForm;

  get a() { return this.marketFrm.controls }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public validation: ValidationService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    public WebStorageService: WebStorageService,
    private commonMethod: CommonMethodsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddMarketListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>,
  ) { this.dateAdapter.setLocale('en-GB') }

  ngOnInit() {
    //console.log("this.WebStorageService.getDistrictId()",this.WebStorageService.getStateId())
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.isViewFlag = this.data?.label == 'View' ? true : false;
    this.data ? (this.onEdit(this.data)) : this.formData();
    if (!this.isViewFlag) {
      this.getState();
      this.getFarmGoods();
    }
  }


  formData(data?: any) {
    //console.log("data",data)
    this.marketFrm = this.fb.group({
      "id": [data ? data?.id : 0],
      "marketName": [data ? data?.marketName : '', [Validators.required, this.validation.maxLengthValidator(100), Validators.pattern(this.validation.fullName)]],
      "m_MarketName": [data ? data?.m_MarketName : '', [Validators.required, this.validation.maxLengthValidator(100), Validators.pattern(this.validation.marathi)]],
      "conactNo": [data ? data?.conactNo : '', [Validators.pattern(this.validation.mobile_No)]],
      "emailId": [data ? data?.emailId : '', [Validators.email, this.validation.maxLengthValidator(50)]],
      "stateId": [data ? data?.stateId : this.WebStorageService.getStateId() == '' ? 0 : this.WebStorageService.getStateId()],
      "districtId": [data ? data?.districtId :  this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId(), [Validators.required]],
      "talukaId": [data ? data?.talukaId : '', [Validators.required]],
      "villageId": [data ? data?.villageId : ''],
      "address": [data ? data?.address : ''],
      "pincode": [data ? data?.pincode : '', [Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.valPinCode)]],
      "estDate": [data ? data?.estDate : ''],
      "latitude": [data ? data?.latitude : '', [Validators.required, Validators.pattern(this.validation.latValidation)]],//number
      "longitude": [data ? data?.longitude : '', [Validators.required, Validators.pattern(this.validation.longValidation)]],//number  
      "administratior": [data ? data?.administratior : '',],
      "mobileNo": [data ? data?.mobileNo : '', [Validators.pattern(this.validation.mobile_No)]],
      "workingHours": [data ? data?.workingHours : '', [Validators.required]],
      "status": [data ? data?.status : ''],//boolean
      "flag": [data ? "u" : "i"],
      "shetMalId": ['', [Validators.required]],
      "committeeAssignShetmal": []
    })
    this.addValidation();
  }

  onEdit(edata?: any) {
    this.editFlag = true;
    this.editObj = edata
    this.formData(edata);
   this.addValidation();
  }

  onSubmit() {
    if (this.marketFrm.invalid) {
      return;
    }
    else {
      this.spinner.show();
      let data = this.marketFrm.getRawValue();
      let obj = {
        "id": data.id,
        "marketName": data.marketName,
        "m_MarketName": data.m_MarketName,
        "conactNo": data.conactNo,
        "emailId": data.emailId,
        "stateId": data.stateId,
        "districtId": data.districtId,
        "talukaId": data.talukaId,
        "villageId": 0,
        "address": data.address,
        "pincode": data.pincode,
        "estDate":this.commonMethod.setDate(data.estDate) || null,
        "latitude": Number(data.latitude),
        "longitude": Number(data.longitude),
        "administratior": data.administratior,
        "mobileNo": data.mobileNo,
        "workingHours": data.workingHours,
        "committeeAssignShetmal": this.sendFarmData(data.shetMalId),
        "createdBy": this.WebStorageService.getUserId(),
        "flag": data?.flag
      }
      this.apiService.setHttp('post', 'sericulture/api/MarketCommittee/AddUpdateMarketCommittee?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.clearMainForm();
          } else {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.errorHandler.handelError(error.statusCode);
        }
      });
    }
  }

  //clear add form functionality here
  clearMainForm() {
    this.formDirective?.resetForm();
    this.formData();
    this.editFlag = false;
  }


  addValidation() {
    if (this.lang == 'en') {
      this.marketFrm.controls["address"].clearValidators();
      this.marketFrm.controls['address'].setValidators([this.validation.maxLengthValidator(100), Validators.pattern(this.validation.alphabetsWithSpecChar)]);
      this.marketFrm.controls["address"].updateValueAndValidity();

      this.marketFrm.controls["administratior"].clearValidators();
      this.marketFrm.controls['administratior'].setValidators([this.validation.maxLengthValidator(30), Validators.pattern(this.validation.fullName)]);
      this.marketFrm.controls["administratior"].updateValueAndValidity();
    } else {
      this.marketFrm.controls["address"].clearValidators();
      this.marketFrm.controls['address'].setValidators([this.validation.maxLengthValidator(100), Validators.pattern(this.validation.marathiquestion)]);
      this.marketFrm.controls["address"].updateValueAndValidity();

      this.marketFrm.controls["administratior"].clearValidators();
      this.marketFrm.controls['administratior'].setValidators([this.validation.maxLengthValidator(30), Validators.pattern(this.validation.marathi)]);
      this.marketFrm.controls["administratior"].updateValueAndValidity();
    }
  }

  //#region ------------------Dropdown code start here--------------------------------------------
  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
          this.editFlag ? (this.a['stateId'].setValue(this.editObj?.stateId)) : '';
          this.getDistrict();
        }
        else {
          this.stateArray = [];
        }
      })
    })
  }

  getDistrict() {
    this.districtArray = [];
    let stateId = this.marketFrm.getRawValue()?.stateId;
    //console.log("stateId",stateId)
    if(stateId != 0){
    this.masterService.GetAllDistrict(stateId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.districtArray = res.responseData;
          this.districtArray.unshift({ "id": 0, "textEnglish": "All District","textMarathi": "सर्व जिल्हे"});
    
          this.editFlag ? this.a['districtId'].setValue(this.editObj?.districtId) : '';
          this.getTaluka();
        }
        else {
          this.districtArray = [];
        }
      })
    })
  }
  }

  getTaluka() {
    this.talukaArray = [];
    let stateId = this.marketFrm.getRawValue()?.stateId
    let disId = this.marketFrm.getRawValue()?.districtId
    if(disId != 0){
    this.masterService.GetAllTaluka(stateId, disId, 0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.talukaArray = res.responseData;
          this.editFlag ? this.a['talukaId'].setValue(this.editObj?.talukaId) : '';
        }
        else {
          this.talukaArray = [];
        }
      })
    })
  }
  }

  getFarmGoods() {
    this.farmGoodsArray = [];
    this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-FarmGoods', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.farmGoodsArray = res.responseData;
          let farmsArray = new Array();
          this.data?.getCommitteeAssignShetmal.map((res: any) => {
            farmsArray.push(res.id)
          })
          this.data ? this.a['shetMalId'].setValue(farmsArray) : '';
        }
        else {
          this.farmGoodsArray = [];
        }
      })
    })
  }

  sendFarmData(event?: any) {
    event.map((res: any) => {
      let obj = {
        "id": 0,
        "marketCommitteeId": 0,
        "shetMalId": res,
        "createdBy": this.WebStorageService.getUserId()
      }
      this.sendFarmDataArray.push(obj)
    })
    return this.sendFarmDataArray
  }
  //#endregion------------------Dropdown code end here--------------------------------------------

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}


