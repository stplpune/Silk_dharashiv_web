import { Component,Inject  } from '@angular/core';
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
  editFlag:boolean = false;
  editObj?:any;

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log("uuuuuuuuuu",this.data)
   this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.data ? this.onEdit(this.data) : this.formData();
   // this.getState();
    //this.getDistrict();
    this.getTaluka();
    this.getFarmGoods();
  }


  formData() {
    this.marketFrm = this.fb.group({
      "id": [0],
      "marketName": ['',[Validators.required,this.validation.maxLengthValidator(100), Validators.pattern(this.validation.fullName)]],
      "m_MarketName": ['',[Validators.required,this.validation.maxLengthValidator(100), Validators.pattern(this.validation.marathi)]],
      "conactNo": ['',[Validators.pattern(this.validation.mobile_No)]],
      "emailId": ['', [Validators.email, this.validation.maxLengthValidator(50)]],
      "stateId": [1],
      "districtId": [1],
      "talukaId": ['',[Validators.required]],
      "address": [''],
      "pincode": ['',[Validators.required,this.validation.maxLengthValidator(6), Validators.pattern(this.validation.fullName)]],
      "estDate": [''],
      "latitude": ['',[Validators.required]],//number
      "longitude": ['',[Validators.required]],//number
      "administratior": ['',this.validation.maxLengthValidator(30), Validators.pattern(this.validation.fullName)],
      "mobileNo": ['',[Validators.pattern(this.validation.mobile_No)]],
      "workingHours": ['',[Validators.required]],
       "status": [''],//boolean
       "shetMalId":['',[Validators.required]]
    })
  }

  get a(){return this.marketFrm.controls }

  onEdit(data?:any){
  this.editObj = data;
  this.editFlag = true;
  console.log("this.editObj",this.editObj)
  this.marketFrm.patchValue({
    "id":this.editObj?.id ,
    "marketName": this.editObj?.marketName ,
    "m_MarketName":this.editObj?.m_MarketName ,
    "conactNo":this.editObj?.conactNo ,
    "emailId":this.editObj?.emailId ,
    "stateId":this.editObj?.stateId ,
    "districtId":this.editObj?.districtId ,
    "talukaId": this.editObj?.talukaId ,
    "address":this.editObj?.address ,
    "pincode":this.editObj?.pincode ,
    "estDate": this.editObj?.estDate ,
    "latitude":this.editObj?.latitude ,//number
    "longitude":this.editObj?.longitude ,//number
    "administratior": this.editObj?.administratior ,
    "mobileNo": this.editObj?.mobileNo ,
    "workingHours": this.editObj?.workingHours ,
    // "shetMalId":this.editObj?.getCommitteeAssignShetmal.map((x:any)=>{return x.shetMalId}) ,
  })
  //this.getState();
 // this.getDistrict();
  this.getFarmGoods();

  }

  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
          this.editFlag ? this.marketFrm.controls['stateId'].setValue(this.editObj?.stateId) : '';
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
          this.editFlag ? (this.marketFrm.controls['districtId'].setValue(this.editObj?.districtId),this.getTaluka()) : this.getTaluka();
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
          this.editFlag ? this.marketFrm.controls['talukaId'].setValue(this.editObj?.talukaId) : '';
        }
        else {
          this.talukaArray = [];
        }
      })
    })
  }

  //  sericulture/api/DropdownService/get-FarmGoods

  getFarmGoods() {
    this.farmGoodsArray = [];
    this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-FarmGoods', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.farmGoodsArray = res.responseData;
         // this.editFlag ? this.marketFrm.controls['shetMalId'].setValue(this.editObj?.shetMalId) : '';
        }
        else {
          this.farmGoodsArray = [];
        }
      })
    })
  }

  sendFarmData(event?:any){ 
    event.map((res:any)=>{
      let obj={
        "id": 0,
       "marketCommitteeId": 0,
      "shetMalId":res,
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
           "id" : data.id,
            "marketName": data.marketName,
            "m_MarketName":data.m_MarketName,
            "conactNo": data.conactNo,
            "emailId": data.emailId,
            "stateId":data.stateId,
            "districtId": data.districtId,
            "talukaId":data.talukaId,
            "villageId": 0,
            "address": data.address,
            "pincode": data.pincode,
            "estDate": data.estDate,
            "latitude": Number(data.latitude),
            "longitude":Number(data.longitude),
            "administratior": data.administratior,
            "mobileNo": data.mobileNo,
            "workingHours": data.workingHours,
            "committeeAssignShetmal": this.sendFarmData(data.shetMalId),
            "createdBy": this.WebStorageService.getUserId() ,
            "flag": 'i'
          }

        // let mainData = { ...obj, "createdBy": this.WebStorageService.getUserId() };
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
