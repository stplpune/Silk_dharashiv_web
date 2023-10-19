import { Component,Inject  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
//import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
// import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
// import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
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

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public validation: ValidationService,
    //private spinner: NgxSpinnerService,
    private masterService: MasterService,
    // private errorHandler: ErrorHandlingService,
    private WebStorageService: WebStorageService,
    // private commonMethod: CommonMethodsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddMarketListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.formData();
    this.getState();
    this.getDistrict();
    this.getTaluka();
    this.getFarmGoods();
  }


  formData() {
    this.marketFrm = this.fb.group({
      "id": [0],
      "marketName": [''],
      "m_MarketName": [''],
      "conactNo": [''],
      "emailId": [''],
      "stateId": [''],
      "districtId": [''],
      "talukaId": [''],
      "villageId": [''],
      "address": [''],
      "pincode": [''],
      "estDate": [''],
      "latitude": [''],//number
      "longitude": [''],//number
      "administratior": [''],
      "mobileNo": [''],
      "workingHours": [''],
       "status": [''],//boolean
       "shetMalId":['']
       
      // "committeeAssignShetmal": [
      //   {
      //     "id": 0,
      //     "marketCommitteeId": 0,
      //     "shetMalId": 0,
      //     "createdBy": 0
      //   }
      // ],
    })
  }

  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
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
        }
        else {
          this.farmGoodsArray = [];
        }
      })
    })
  }

  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

}
