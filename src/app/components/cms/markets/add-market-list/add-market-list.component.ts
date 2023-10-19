import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public validation: ValidationService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    private WebStorageService: WebStorageService,
    private commonMethod: CommonMethodsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddMarketListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dateAdapter: DateAdapter<Date>,
    ) {this.dateAdapter.setLocale('en-GB')}

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
   this.data ? this.onEdit(this.data) : this.formData();
    this.getState();
    this.getDistrict();
    this.getTaluka();
    this.getFarmGoods();
  }


  formData(data?:any) {
    this.marketFrm = this.fb.group({
      "id": [data ? data?.id : 0],
      "marketName": [data ? data?.marketName : '',[Validators.required,this.validation.maxLengthValidator(100), Validators.pattern(this.validation.fullName)]],
      "m_MarketName": [data ? data?.m_MarketName : '',[Validators.required,this.validation.maxLengthValidator(100), Validators.pattern(this.validation.marathi)]],
      "conactNo": [data ? data?.conactNo : '',[Validators.pattern(this.validation.mobile_No)]],
      "emailId": [data ? data?.emailId : '',[Validators.email, this.validation.maxLengthValidator(50)]],
      "stateId": [1],
      "districtId": [1],
      "talukaId": [data ? data?.talukaId : '',[Validators.required]],
      "villageId": [data ? data?.villageId : ''],
      "address": [data ? data?.address : '',[Validators.pattern(this.validation.alphabetsWithSpecChar)]],
      "pincode": [data ? data?.pincode : '',[Validators.required,this.validation.maxLengthValidator(6),Validators.pattern(this.validation.valPinCode)]],
      "estDate": [data ? data?.estDate : ''],
      "latitude": [data ? data?.latitude : '',[Validators.required]],//number
      "longitude": [data ? data?.longitude : '',[Validators.required]],//number
      "administratior": [data ? data?.administratior : '',[this.validation.maxLengthValidator(30), Validators.pattern(this.validation.fullName)]],
      "mobileNo": [data ? data?.mobileNo : '',[Validators.pattern(this.validation.mobile_No)]],
      "workingHours": [data ? data?.workingHours : '',[Validators.required]],
      "status": [data ? data?.status : ''],//boolean
      "shetMalId": ['',[Validators.required]],
      "committeeAssignShetmal": []
    })
}

onEdit(edata?:any){
  this.editFlag = true;
  this.formData(edata);
}

 // formData() {
  //   this.marketFrm = this.fb.group({
  //     "id": [0],
  //     "marketName": ['',[Validators.required,this.validation.maxLengthValidator(100), Validators.pattern(this.validation.fullName)]],
  //     "m_MarketName": ['',[Validators.required,this.validation.maxLengthValidator(100), Validators.pattern(this.validation.marathi)]],
  //     "conactNo": ['',[Validators.pattern(this.validation.mobile_No)]],
  //     "emailId": ['', [Validators.email, this.validation.maxLengthValidator(50)]],
  //     "stateId": [1],
  //     "districtId": [1],
  //     "talukaId": ['',[Validators.required]],
  //     "address": [''],
  //     "pincode": ['',[Validators.required,this.validation.maxLengthValidator(6),Validators.pattern(this.validation.valPinCode)]],
  //     "estDate": [''],
  //     "latitude": ['',[Validators.required]],//number
  //     "longitude": ['',[Validators.required]],//number
  //     "administratior": ['',this.validation.maxLengthValidator(30), Validators.pattern(this.validation.fullName)],
  //     "mobileNo": ['',[Validators.pattern(this.validation.mobile_No)]],
  //     "workingHours": ['',[Validators.required]],
  //      "status": [''],//boolean
  //      "shetMalId":['',[Validators.required]]
  //   })
  // }

get a() { return this.marketFrm.controls }

getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
          this.editFlag ? this.a['stateId'].setValue(this.editObj?.stateId) : '';
        }
        else {
          this.stateArray = [];
        }
      })
    })
  }

getDistrict() {
    this.districtArray = [];
    this.masterService.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.districtArray = res.responseData;
          this.editFlag ? (this.a['districtId'].setValue(this.editObj?.districtId), this.getTaluka()) : this.getTaluka();
        }
        else {
          this.districtArray = [];
        }
      })
    })
}

 getTaluka() {
    this.talukaArray = [];
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
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
        "estDate": data.estDate,
        "latitude": Number(data.latitude),
        "longitude": Number(data.longitude),
        "administratior": data.administratior,
        "mobileNo": data.mobileNo,
        "workingHours": data.workingHours,
        "committeeAssignShetmal": this.sendFarmData(data.shetMalId),
        "createdBy": this.WebStorageService.getUserId(),
        "flag": 'i'
      }
    this.apiService.setHttp('post', 'sericulture/api/MarketCommittee/AddUpdateMarketCommittee?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            // this.clearMainForm();
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

}
