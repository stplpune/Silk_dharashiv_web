import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { SchemesComponent } from '../schemes.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ApiService } from 'src/app/core/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-scheme',
  templateUrl: './add-scheme.component.html',
  styleUrls: ['./add-scheme.component.scss']
})
export class AddSchemeComponent {
  schemeForm!: FormGroup;
  imageResponse: string = '';
  stateArray = new Array();
  districtArray = new Array();
  @ViewChild('uplodLogo') clearlogo!: any;
  @ViewChild('formDirective') private formDirective!: NgForm;
  subscription!: Subscription;
  lang: string = 'English';
  isViewFlag: boolean = false;
  editorConfig = this.commonMethodService.editorConfig;
  editorFlag:boolean=false;
  constructor
  (
    public dialogRef: MatDialogRef<SchemesComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private master: MasterService,
    private fileUpl: FileUploadService,
    public validator: ValidationService,
    private spinner: NgxSpinnerService,
    private commonMethodService: CommonMethodsService,
    private WebStorageService: WebStorageService,
    private errorService: ErrorHandlingService,
    private apiService: ApiService,

  ){}

  ngOnInit(){
    console.log("data",this.data)
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.isViewFlag = this.data?.label == 'View' ? true : false;
    if (!this.isViewFlag) {
      this.getFormData();
      this.getState();
    }
  }

  getFormData() {
    this.schemeForm = this.fb.group({
      schemeType: [this.data ? this.data.schemeType : '', [Validators.required, Validators.pattern(this.validator.alphaNumericWithSpace), this.validator.maxLengthValidator(100)]],
      stateId: [this.data ? this.data.stateId : 1],
      districtId: [this.data ? this.data.districtId : 1],
      logoPath: [''],
      isActive: [this.data ? this.data.isActive : true],
      schemeInfo: [this.data ? this.data.schemeInfo : '', [Validators.required, this.validator.maxLengthValidator(5000)]],
      m_SchemeType: [this.data ? this.data.m_SchemeType : '', [Validators.required, Validators.pattern(this.validator.marathi), this.validator.maxLengthValidator(100)]]
    })
    this.imageResponse = this.data ? this.data.logoPath : '';
  }

  get f() { return this.schemeForm.controls };

  getState() {
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
        this.data ? (this.schemeForm.controls['stateId'].setValue(this.data?.stateId), this.getDisrict()) : this.getDisrict();
      }), error: (() => {
        this.stateArray = [];
      })
    })
  }

  getDisrict() {
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.data ? this.schemeForm.controls['districtId'].setValue(this.data?.districtId) : '';
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.imageResponse = res.responseData;
        }
        else {
          this.clearlogo.nativeElement.value = "";
          this.imageResponse = "";
        }
      }),
      error: (error: any) => {
        this.clearlogo.nativeElement.value = "";
        this.spinner.hide();
        this.commonMethodService.checkDataType(error.status) == false ? this.errorService.handelError(error.statusCode) : this.commonMethodService.snackBar(error.statusText, 1);
      }
    })
  }

  viewimage() {
    window.open(this.imageResponse, '_blank')
  }

  deleteImage() {
    this.imageResponse = "";
    this.clearlogo.nativeElement.value = "";
  }

  onSubmitData() {
    let formData = this.schemeForm.getRawValue();
    this.spinner.show();
    if (this.schemeForm.invalid || formData.schemeInfo) {
      this.editorFlag=true;
      this.spinner.hide();
      return
    } else if (!this.imageResponse) {
      this.commonMethodService.snackBar("Please Scheme Uploade Logo", 1);
      this.spinner.hide();
      return;
    }
    else {
      formData.id = this.data ? this.data.id : 0;
      formData.logoPath = this.imageResponse;
      let mainData = { ...formData, "createdBy": this.WebStorageService.getUserId() };
      this.apiService.setHttp('post', 'sericulture/api/Scheme/Insert-Update-Scheme', false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
            this.commonMethodService.snackBar(res.statusMessage, 0)
            this.clearForm();
            this.formDirective.reset();
            this.dialogRef.close('Yes');
            this.editorFlag=false;
          } else {
            this.spinner.hide();
            this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.spinner.hide();
          this.errorService.handelError(error.status);
        }
      })
    }
  }

   clearForm() {
    this.formDirective.resetForm({
      stateId: 1,
      districtId: 1
    });
    this.clearlogo.nativeElement.value = "";
    this.imageResponse = "";
    this.data = null;
    this.editorFlag=false;
  }
}
