import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
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
    public validation :ValidationService,
    public dialogRef: MatDialogRef<AddDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {

    
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.cropDetailsFormData();
    this.getAllfarmsGood();
   }

  cropDetailsFormData() {
    this.cropDetailsForm = this.fb.group({
      "id": [this.data?.id || 0],
      "applicationId": [this.data?.applicationId || 0 ],
      "cropId": ['' || this.data?.cropId ,[Validators.required]],
      "area": ['' || this.data?.area ,[Validators.required,Validators.maxLength(6),Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]],
      "totalProduction": ['' || this.data?.totalProduction,[Validators.required,Validators.maxLength(10),Validators.pattern(this.validation.onlyNumbers)]],
      "averageRate": ['' || this.data?.averageRate,[Validators.required,Validators.maxLength(10),Validators.pattern(this.validation.onlyNumbers)]],
      "totalProductionAmt": ['' || this.data?.totalProductionAmt,[Validators.required,Validators.maxLength(10),Validators.pattern(this.validation.onlyNumbers)]],
      "totalExpenses": [''  || this.data?.totalExpenses,[Validators.required,Validators.maxLength(10),Validators.pattern(this.validation.onlyNumbers)]],
      "netIncome": ['' || this.data?.netIncome,[Validators.required,Validators.maxLength(10),Validators.pattern(this.validation.onlyNumbers)]],
      "acreNetIncome": ['' || this.data?.acreNetIncome,[Validators.required,Validators.maxLength(10),Validators.pattern(this.validation.onlyNumbers)]],
      "createdBy": 0,    
      "isDeleted": false,
      "cropName": [''],
      "m_CropName": [''],

    })
  }

  get fL(){return this.cropDetailsForm.controls}

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
    let formValue = this.cropDetailsForm.getRawValue();
   let obj:any =  this.farmsGoodArray.filter((ele:any)=>{return ele.id == formValue.cropId})
   formValue.cropName = obj[0]?.textEnglish; 
   formValue.m_CropName = obj[0]?.textMarathi; 
    if(this.cropDetailsForm.invalid){
      return;
    }else{
      this.dialogRef.close(formValue);
    }
  }





}
