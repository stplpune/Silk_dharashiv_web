import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,NgForm,Validators } from '@angular/forms';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.scss']
})
export class AddDocumentsComponent {
  uploadFrm !: FormGroup;
  imageData: string = '';
  subscription!: Subscription;//used  for lang conv
  lang: any;
  @ViewChild('uplodLogo') clearImg!: any;
  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(
    private fb: FormBuilder,
   private apiService: ApiService,
     public validation: ValidationService,
     private spinner: NgxSpinnerService,
  //   // private masterService: MasterService,
       private errorHandler: ErrorHandlingService,
        private fileUplService: FileUploadService,
      private WebStorageService: WebStorageService,
     private commonMethod: CommonMethodsService,
    // public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    console.log("data",this.data)
    this.addDefaultFrm();
  }

  addDefaultFrm() {
    this.uploadFrm = this.fb.group({
      "id": [0],
      "docNo": [''],
      "docname": ['',[this.validation.maxLengthValidator(50), Validators.pattern(this.validation.fullName)]],
      "docPath": ['',[Validators.required]]
    })
  }

  get f(){return this.uploadFrm.controls}


  imageUplod(event: any) {
    this.spinner.show();
    this.fileUplService.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
         this.imageData = res.responseData;
          this.f['docPath'].setValue(this.imageData)
        }
        else {
          this.clearImg.nativeElement.value = "";
          this.imageData = "";
        }
      }),
      error: (error: any) => {
        this.clearImg.nativeElement.value = "";
         this.spinner.hide();
        this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  viewimage() {
    window.open(this.imageData, '_blank')
  }

  deleteImage() {
    this.imageData = "";
    this.clearImg.nativeElement.value = "";
  }

  onSubmit() {
    if (this.uploadFrm.invalid) {
      return;
    }
    else {
      this.spinner.show();
      let data = this.uploadFrm.getRawValue();
      let obj ={
        "applicationId": this.data?.actionId,
        "docTypeId": 0,
         "createdBy": new Date(),
        "createdDate": this.WebStorageService.getUserId() ,
        "modifiedBy": new Date(),
        "modifiedDate": this.WebStorageService.getUserId() ,
        "isDeleted": false

      }
      data.id = Number(data.id)
      let mainData = { ...data,...obj };
      this.apiService.setHttp('post', 'sericulture/api/Application/InsertUpdateDocuments', false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.formDirective?.resetForm();
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






  // [
  //   {
  //     "id": 0,
  //     "applicationId": 0,
  //     "docTypeId": 0,
  //     "docNo": "string",
  //     "docname": "string",
  //     "docPath": "string",
  //     "createdBy": 0,
  //     "createdDate": "2023-11-02T04:38:55.985Z",
  //     "modifiedBy": 0,
  //     "modifiedDate": "2023-11-02T04:38:55.985Z",
  //     "isDeleted": true
  //   }
  // ]
}





