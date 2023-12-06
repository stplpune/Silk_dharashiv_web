import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
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
    private WebStorageService : WebStorageService,
    public dialogRef: MatDialogRef<AddDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    console.log("data",this.data);
    
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.cropDetailsFormData();
    this.getAllfarmsGood();
   }

  cropDetailsFormData() {
    this.cropDetailsForm = this.fb.group({
      "id": [0 || this.data?.id ],
      "applicationId": [0 || this.data?.id ],
      "cropId": ['' || this.data?.cropId ,[Validators.required]],
      "area": ['' || this.data?.area ,[Validators.required]],
      "totalProduction": ['' || this.data?.totalProduction,[Validators.required]],
      "averageRate": ['' || this.data?.averageRate,[Validators.required]],
      "totalProductionAmt": ['' || this.data?.totalProductionAmt,[Validators.required]],
      "totalExpenses": [''  || this.data?.totalExpenses,[Validators.required]],
      "netIncome": ['' || this.data?.netIncome,[Validators.required]],
      "acreNetIncome": ['' || this.data?.acreNetIncome,[Validators.required]],
      "createdBy": 0,    
      "isDeleted": true,
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
    if(this.cropDetailsForm.invalid){
      return;
    }else{
      this.dialogRef.close(formValue);
    }
  }





}
