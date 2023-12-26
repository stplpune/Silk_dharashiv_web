import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MarketRateComponent } from '../market-rate.component';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-add-market-rate',
  templateUrl: './add-market-rate.component.html',
  styleUrls: ['./add-market-rate.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, MatDatepickerModule, NgFor, NgIf, DatePipe, MatCardModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, MatRadioModule, MatIconModule, MatDialogModule, TranslateModule],
})
export class AddMarketRateComponent implements OnDestroy{
  marketForm !: FormGroup;
  marketArr = new Array();
  goodsArr = new Array();
  unitArr = new Array();
  viewFlag: boolean = false;
  editFlag : boolean = false;
  lang: any;
  subscription!: Subscription;
  maxDate = new Date();

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    public dialogRef: MatDialogRef<MarketRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlingService,
    public WebStorageService: WebStorageService,
    public validator: ValidationService,
    private dateAdapter: DateAdapter<Date>
  ) { this.dateAdapter.setLocale('en-GB')}
  get f() { return this.marketForm.controls }
  @ViewChild('formDirective') private formDirective!: NgForm;
  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.viewFlag = this.data?.label == "View" ? true : false;
    !this.viewFlag ? (this.formdata(), this.getAllMarket(), this.getFarmsGood(), this.getAllUnit()) : ''
  }

  formdata() {
    this.marketForm = this.fb.group({
      "id": [this.data?.id || 0],
      "marketCommitteeId": [this.data?.marketCommitteeId || '', [Validators.required]],
      "shetmalCastId": [this.data?.shetmalCastId || '', [Validators.required]],
      "marketRateDate": [this.data?.marketRateDate || '', [Validators.required]],
      "unitId": [this.data?.unitId || '', [Validators.required]],
      "minRate": [this.data?.minRate || '', [Validators.required,Validators.pattern(this.validator.numericWithdecimaluptotwoDigits), this.validator.maxLengthValidator(10)]],
      "maxRate": [this.data?.maxRate || '', [Validators.required,Validators.pattern(this.validator.numericWithdecimaluptotwoDigits), this.validator.maxLengthValidator(10)]],
      "averageRate": [this.data?.averageRate || '', [Validators.required,Validators.pattern(this.validator.numericWithdecimaluptotwoDigits), this.validator.maxLengthValidator(10)]],
      "income": [this.data?.income || '', [Validators.required,Validators.pattern(this.validator.numericWithdecimaluptotwoDigits), this.validator.maxLengthValidator(10)]],
      "createdBy": [0],
      "flag": [this.data ? 'u' : 'i']
    })
  }

  getAllMarket() {
    this.apiService.setHttp('get', 'sericulture/api/DropdownService/get-MarketCommittee', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.marketArr = res.responseData
        } else {
          this.marketArr = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorHandler.handelError(err.statusCode) })
    });
  }

  getFarmsGood() {
    this.apiService.setHttp('get', 'sericulture/api/DropdownService/get-FarmGoods', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.goodsArr = res.responseData
        } else {
          this.goodsArr = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorHandler.handelError(err.statusCode) })
    });
  }

  getAllUnit() {
    this.apiService.setHttp('get', 'sericulture/api/DropdownService/get-Unit', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.unitArr = res.responseData
        } else {
          this.unitArr = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorHandler.handelError(err.statusCode) })
    });
  }

  checkrate(){
    const formdata=this.marketForm.getRawValue()
    this.f['maxRate'].setValidators([Validators.required,Validators.min(formdata?.minRate)])
    this.f['averageRate'].setValidators([Validators.required,Validators.min(formdata?.minRate),Validators.max(formdata?.maxRate)])
  }

  onSubmit() {
    let formvalue = this.marketForm.getRawValue();
    if (this.marketForm.invalid) {
      return
    } else {
      this.spinner.show();
      formvalue.marketRateDate=this.commonMethod.setDate( formvalue?.marketRateDate)
      this.apiService.setHttp('POST', 'sericulture/api/MarketPrice/AddUpdateMarketRate?lan=' + this.lang, false, formvalue, false, 'masterUrl');
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


  clearFormData() { 
    this.formDirective?.resetForm();
    this.data = null;
    this.formdata();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }



}
