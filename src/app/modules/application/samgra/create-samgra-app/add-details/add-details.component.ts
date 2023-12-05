import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss']
})
export class AddDetailsComponent {

  cropDetailsForm !: FormGroup;
  farmsGoodArray = new Array();
  subscription!: Subscription;
  lang: any;

  constructor( 
    private fb :FormBuilder,
    private masterService : MasterService,
    private apiService : ApiService,
    private spinner : NgxSpinnerService,
    private commonMethod : CommonMethodsService,
    private errorHandler : ErrorHandlingService,
    private WebStorageService : WebStorageService,
    public dialogRef: MatDialogRef<AddDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.cropDetailsFormData();
    this.getAllfarmsGood();
   }

  cropDetailsFormData() {
    this.cropDetailsForm = this.fb.group({
      "id": [0],
      "applicationId": [0],
      "cropId": ['',[Validators.required]],
      "area": ['',[Validators.required]],
      "totalProduction": ['',[Validators.required]],
      "averageRate": ['',[Validators.required]],
      "totalProductionAmt": ['',[Validators.required]],
      "totalExpenses": ['',[Validators.required]],
      "netIncome": ['',[Validators.required]],
      "acreNetIncome": ['',[Validators.required]],
      "createdBy": 0,
      "createdDate": new Date(),
      "modifiedBy": 0,
      "modifiedDate": new Date(),
      "isDeleted": true,
      "flag": "string"
    })
  }


  getAllfarmsGood(){
    this.farmsGoodArray = [];
    this.masterService.getFarmGoods().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.farmsGoodArray = res.responseData;          
        }
        else {
          this.farmsGoodArray = [];
        }
      })
    })
  }  


  onSubmit(){    
    let formValue = this.cropDetailsForm.value;
    console.log("cropDetailsForm controls",this.cropDetailsForm.controls);
    
    if(this.cropDetailsForm.invalid){
      return;
    }else{
      this.dialogRef.close(formValue);
    }
    
    

    return;
    this.apiService.setHttp('post', 'sericulture/api/Application/insert-update-current-product-details?lan=' + this.lang, false, formValue, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.commonMethod.snackBar(res.statusMessage, 0);
          // this.dialogRef.close('Yes');
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
