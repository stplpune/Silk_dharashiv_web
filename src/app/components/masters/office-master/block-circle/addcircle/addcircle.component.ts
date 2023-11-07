import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf, NgFor, AsyncPipe} from '@angular/common';
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
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@Component({
  selector: 'app-addcircle',
  templateUrl: './addcircle.component.html',
  styleUrls: ['./addcircle.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule,MatButtonModule, MatSelectModule, FormsModule, ReactiveFormsModule, NgIf,MatInputModule, NgFor,MatRadioModule,MatIconModule,MatDialogModule,TranslateModule,NgxMatSelectSearchModule,AsyncPipe],
})
export class AddcircleComponent implements OnDestroy{
  addBlockForm !: FormGroup;
  stateArr = new Array();
  districtArr = new Array();
  talukaArr = new Array();
  villageArr = new Array();
  lang:any;
  subscription!: Subscription;
  viewFlag : boolean = false;
  isAssigngramFlag:boolean=false;
  @ViewChild('formDirective') private formDirective!: NgForm;
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    public validator: ValidationService,
    public WebStorageService : WebStorageService,    
    public dialogRef: MatDialogRef<BlockCircleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) { }
  get f() { return this.addBlockForm.controls }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.viewFlag = this.data?.label == "View" ? true : false;
    !this.viewFlag ? (this.formData(),this.getState()) : ''
    this.searchDataZone();
  }

  formData(){
    this.addBlockForm = this.fb.group({
      "id": [this.data?.id || 0],
      "blockName": [this.data?.blockName || '',[Validators.required,Validators.pattern(this.validator.fullName),this.validator.maxLengthValidator(30)]],
      "m_BlockName": [this.data?.m_BlockName || '',[Validators.required,Validators.pattern(this.validator.marathi),this.validator.maxLengthValidator(30)]],
      "stateId": [this.data ? this.data?.stateId : this.WebStorageService.getStateId() == '' ? 0 : this.WebStorageService.getStateId()],
      "districtId": [this.data ? this.data?.districtId :  this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],
      "talukas": ['',[Validators.required]],
      "createdBy": this.WebStorageService.getUserId(),
      "flag": [this.data ? "u" : "i"]
    })
  }
  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
  }
  getState() {
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArr = res.responseData; 
        this.data ? (this.f['stateId'].setValue(this.data.stateId),this.getDistrict()) : this.getDistrict();      
      }),
      error: () => { this.stateArr = [];}
    })
  }

  getDistrict() {
    let stateId = this.addBlockForm.getRawValue().stateId;
    this.masterService.GetAllDistrict(stateId).subscribe({
      next: ((res: any) => {
        this.districtArr = res.responseData;
        this.data ? (this.f['districtId'].setValue(this.data.districtId),this.getTaluka()) :this.getTaluka(); 
      }),
      error: () => { this.districtArr = [];}
    })
  }

  getTaluka(){
    let stateId = this.addBlockForm.getRawValue().stateId;
    let districtId = this.addBlockForm.getRawValue().districtId;
    this.masterService.GetAllTaluka(stateId,districtId,0).subscribe({
      next: ((res: any) => {
        this.talukaArr = res.responseData;
        this.commonMethod.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
        if(this.data){
          let taluka = new Array()
          this.data?.getTalukaModel.forEach((res:any )=> {
            taluka.push(res.id)
          });
            taluka.forEach((res:any)=>{
            this.talukaArr.filter((tal:any)=>tal.id == res ? tal.isAssigned = true : tal.isAssigned = tal.isAssigned)
          })
          this.f['talukas'].setValue(taluka)
        }
      }),
      error: () => { this.talukaArr = [];}
    })
  }
  onSubmit() {
    let formvalue = this.addBlockForm.getRawValue();
    formvalue.talukas = this.addBlockForm.value.talukas.toString();
    if (this.addBlockForm.invalid) {
      return
    } else {  
      this.apiService.setHttp('POST', 'sericulture/api/TalukaBlocks/AddUpdateTalukaBlocks?lan='+this.lang, false, formvalue, false, 'masterUrl');
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

  clearFormData(){
    this.formDirective.resetForm();
    this.data=null;
    this.formData();
  }

  ngOnDestroy() {
    this.talukaSubject.unsubscribe();
    this.subscription?.unsubscribe();
  }
}
