import { Component, Inject } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf, NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';import {MatRadioModule} from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MasterService } from 'src/app/core/services/master.service';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { BlockCircleComponent } from '../block-circle.component';
import { ValidationService } from 'src/app/core/services/validation.service';


@Component({
  selector: 'app-addcircle',
  templateUrl: './addcircle.component.html',
  styleUrls: ['./addcircle.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule,MatButtonModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgIf,MatInputModule, NgFor,MatRadioModule,MatIconModule,MatDialogModule],
})
export class AddcircleComponent {
  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  addBlockForm !: FormGroup;
  stateArr = new Array();
  districtArr = new Array();
  talukaArr = new Array();
  villageArr = new Array();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    public validator: ValidationService,
    public dialogRef: MatDialogRef<BlockCircleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) { }
  get f() { return this.addBlockForm.controls }

  ngOnInit() {
    this.formData();
    this.getState();
    this.getTaluka();
    console.log("data",this.data); 
  }

  formData(){
    this.addBlockForm = this.fb.group({
      "id": [this.data?.id || 0],
      "blockName": [this.data?.blockName || '',[Validators.required]],
      "m_BlockName": [this.data?.m_BlockName || '',[Validators.required]],
      "stateId": [0],
      "districtId": [0],
      "talukas": ['',[Validators.required]],
      "createdBy": 0,
      "flag": [this.data ? "u" : "i"]
    })
  }

  getState() {
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArr = res.responseData; 
        this.data ? (this.f['stateId'].setValue(this.data.stateId),this.getDistrict()) : '';      
      }),
      error: () => { this.stateArr = [];}
    })
  }

  getDistrict() {
    let stateId = this.addBlockForm.value.stateId;
    this.masterService.GetAllDistrict(stateId).subscribe({
      next: ((res: any) => {
        this.districtArr = res.responseData;
        this.data ? (this.f['districtId'].setValue(this.data.districtId),this.getTaluka()) : ''; 
      }),
      error: () => { this.districtArr = [];}
    })
  }

  getTaluka(){
    // let stateId = this.addBlockForm.value.stateId;
    // let districtId = this.addBlockForm.value.districtId;
    this.masterService.GetAllTaluka(0,0,0).subscribe({
      next: ((res: any) => {
        this.talukaArr = res.responseData;
        let taluka = new Array()
        this.data?.getTalukaModel.forEach((res:any )=> {
          taluka.push(res.id)
        });
        this.data ? (this.f['talukas'].setValue(taluka)) : ''; 
      }),
      error: () => { this.talukaArr = [];}
    })
  }

  // getVillage(){
  //   let stateId = 0;
  //   let districtId = 0;
  //   let talukaId = 0;
  //   this.masterService.GetAllVillage(stateId,districtId,talukaId,0).subscribe({
  //     next: ((res: any) => {
  //       this.villageArr = res.responseData;
  //     }),
  //     error: () => { this.villageArr = [];}
  //   })
  // }

  onSubmit() {
   let talukaaa =  this.addBlockForm.value.talukas.toString();
   this.addBlockForm.value.talukas =talukaaa
    let formvalue = this.addBlockForm.value;
    if (this.addBlockForm.invalid) {
      return
    } else {  
      console.log("formValue",formvalue);
          
      this.apiService.setHttp('POST', 'sericulture/api/TalukaBlocks/AddUpdateTalukaBlocks', false, formvalue, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
            this.commonMethod.snackBar(res.statusMessage, 0);  
            this.dialogRef.close('Yes');       
          } else {
            this.spinner.hide();
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (() => { this.spinner.hide(); })
      })
    }
  }
}
