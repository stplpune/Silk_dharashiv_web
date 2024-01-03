import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';

@Component({
  selector: 'app-add-silk-cocoon-sell',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatNativeDateModule, MatDatepickerModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule],
  templateUrl: './add-silk-cocoon-sell.component.html',
  styleUrls: ['./add-silk-cocoon-sell.component.scss']
})
export class AddSilkCocoonSellComponent {

  cocoonSellFrm!: FormGroup;
  isViewFlag: boolean = false;
  // @ViewChild('formDirective') private formDirective!: NgForm;
  subscription!: Subscription;
  lang: any;
  lotNoArr = new Array();
  marketCommitteeArr = new Array();
  imageResponse : any
  get f() { return this.cocoonSellFrm.controls };

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    // public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    // public dialog: MatDialog,
    private fileUpl: FileUploadService,
    public webStorage: WebStorageService,
    public dialogRef: MatDialogRef<AddSilkCocoonSellComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    // this.isViewFlag = this.data?.label == 'View' ? true : false;
    this.defaultFrm();
    this.getLotNumber();
    this.getMarketCommittee();
  }

  defaultFrm() {
    this.cocoonSellFrm = this.fb.group({
      "id": 0,
      "lotNo": ['',[Validators.required]],
      "silkCasteId": 0,
      "distributedChawki": [''],
      "marketCommiteeId": ['',[Validators.required]],
      "silkSellDate": ['',[Validators.required]],
      "billNo": ['',[Validators.required]],
      "silkRatePerKg":['',[Validators.required]],
      "totalSilk": ['',[Validators.required]],
      "totalAmount": [''],
      "marketFees": ['',[Validators.required]],
      "totalAmtWithMarketFees": 0,
      "remark": [''],
      "billPhoto": [''],
      // "createdBy": 0      
    })
  }

  getLotNumber() {
    this.apiService.setHttp('GET', `sericulture/api/Beneficiery/GetFarmerWiseLotNumber?FarmerId=27&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.lotNoArr = res.responseData;

          console.log("this.lotNoArr",this.lotNoArr);
          
        }
      },
      error: (err: any) => {
        this.errorService.handelError(err.status);
      },
    });
  }

  getLotNoDetails(lotNo:any){
    this.apiService.setHttp('GET', `sericulture/api/Beneficiery/GetRaceTypeAndChawki?FarmerId=27&LotNumber=${lotNo}&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          let lotDetails = res.responseData;
          console.log("lotDetails",lotDetails);
          
          this.f['silkCasteId'].setValue(lotDetails.raceTypeId);   
          this.f['distributedChawki'].setValue(lotDetails.distributionChawki);    
        }
      },
      error: (err: any) => {
        this.errorService.handelError(err.status);
      },
    });
  }

  getMarketCommittee() {
    this.apiService.setHttp('GET', `sericulture/api/DropdownService/get-MarketCommittee?lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.marketCommitteeArr = res.responseData;
        }
      },
      error: (err: any) => {
        this.errorService.handelError(err.status);
      },
    });
  }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc', '', '', this.lang).subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.imageResponse = res.responseData;    
        }
        else {
          this.imageResponse = "";
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.common.checkDataType(error.status) == false ? this.errorService.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
  }

  viewimage(obj: any) {
    window.open(obj, '_blank')
  }

  onSubmitData() {
    let formvalue = this.cocoonSellFrm.value;
    if (this.cocoonSellFrm.invalid) {
      return
    } else {
      this.spinner.show();
      formvalue.id = Number(formvalue.id)
      let mainData = { ...formvalue, "createdBy": this.webStorage.getUserId() , "billPhoto" : this.imageResponse};
      this.apiService.setHttp('POST', 'sericulture/api/SilkSell/InsertUpdateSilkSellDetails?lan' + this.lang, false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
            this.common.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
          } else {
            this.spinner.hide();
            this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
          }
        }),
        error: ((error: any) => {
          this.spinner.hide()
          this.errorService.handelError(error.status)
        })
      })
    }
  }

  calculateAmount(flag:any){
    let formValue = this.cocoonSellFrm.value
    if(flag == 'total'){
      let totalAmount = Number(formValue.silkRatePerKg) * Number(formValue.totalSilk)
      this.f['totalAmount'].setValue(totalAmount)
    }else if(flag == 'marketFees'){
     let maketFeeTotal = Number(formValue.totalAmount) - Number(formValue.marketFees)
     console.log('maketFeeTotal',maketFeeTotal);     
     this.f['totalAmtWithMarketFees'].setValue(maketFeeTotal)
    }  
    
  }

}
