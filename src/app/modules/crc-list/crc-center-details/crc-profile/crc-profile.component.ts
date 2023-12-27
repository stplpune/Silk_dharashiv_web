import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'src/app/core/services/master.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { TranslateModule } from '@ngx-translate/core';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';


@Component({
  selector: 'app-crc-profile',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './crc-profile.component.html',
  styleUrls: ['./crc-profile.component.scss'],
})
export class CrcProfileComponent {
  tableDataArray: any;
  subscription!: Subscription;
  lang: string = 'English';
  routingData: any;
  id: any;
  statusArray = new Array();
  statusForm!: FormGroup;
  editFlag: boolean = false;
  crcNameMR: any;
  crcNameEn: any;
  constructor
    ( private route: ActivatedRoute,
      private apiService: ApiService,
      private spinner: NgxSpinnerService,
      private errorHandler: ErrorHandlingService,
      private commonMethod: CommonMethodsService,
      public WebStorageService: WebStorageService,
      public encryptdecrypt: AesencryptDecryptService,
      private router: Router,
      private masterService: MasterService,
      private fb: FormBuilder,
      public validator: ValidationService,

  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.route.queryParams.subscribe((queryParams: any) => {
      this.routingData = queryParams['id'];
    });
   let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');
   this.id = spliteUrl[0]; 
   this.crcNameEn = spliteUrl[1];
   this.crcNameMR = spliteUrl[2];
    this.getFormData();
    this.getStatus();
    this.getTableDataById();
  }

  getFormData(data?: any) {
    this.statusForm = this.fb.group({
      "status": [data ? data?.statusId : 0],
      "chalkyApprovedQty": [''],
      "reason": [''],
    })
  }


  getStatus() {
    this.masterService.getCRCStatus().subscribe({
      next: ((res: any) => {
        this.statusArray = res.responseData;
      }), error: (() => {
        this.statusArray = [];
      })
    })
  }
  getTableDataById() {    
    this.spinner.show();
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/get-crc-center-profile?Id='+this.id, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.getFormData(this.tableDataArray);
        } else {
          this.spinner.hide();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : '';
          this.tableDataArray = [];
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status);
      },
    });
  }

  viewPdf() {
    window.open(this.tableDataArray?.certificatePath)
  }

  onSubmitData() {
    let formData = this.statusForm.getRawValue();
    formData.id = this.tableDataArray.id;
    formData.createdBy = this.WebStorageService.getUserId();
    formData.status == 5 ? formData.chalkyApprovedQty = 0 : formData.reason ="";
    if (this.statusForm.invalid) {
      this.spinner.hide();
      return
    } else {
      this.apiService.setHttp('put', 'sericulture/api/UserRegistration/CRC_Approval_Status?lan=' + this.lang, false, formData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.statusForm.reset();
            this.getTableDataById();
            this.router.navigate(['crc-list'])
          }
          else {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.errorHandler.handelError(error.status);
        }
      })
    }
  }

  addValidation(id?: any) {
    if (id == 12) {
      this.statusForm.controls["reason"].setValue("");
      this.statusForm.controls["chalkyApprovedQty"].clearValidators();
      this.statusForm.controls['chalkyApprovedQty'].setValidators([Validators.required]);
      this.statusForm.controls["chalkyApprovedQty"].updateValueAndValidity();
    } else if (id == 5) {
      this.statusForm.controls["chalkyApprovedQty"].setValue(0);
      this.statusForm.controls["reason"].clearValidators();
      this.statusForm.controls['reason'].setValidators([Validators.required]);
      this.statusForm.controls["reason"].updateValueAndValidity();
    }
  }

  clearFormData() {
    this.router.navigate(['crc-list']);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
