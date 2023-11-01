import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-blogs',
  templateUrl: './add-blogs.component.html',
  styleUrls: ['./add-blogs.component.scss']
})
export class AddBlogsComponent {
  blogForm!: FormGroup;
  isViewFlag : boolean = false;
  get f() { return this.blogForm.controls };
  @ViewChild('uplodLogo') clearlogo!: any;
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  imageResponse: string = '';
  editorConfig = this.common.editorConfig;
  @ViewChild('formDirective') private formDirective!: NgForm;
  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public dialog: MatDialog,
    public webStorage: WebStorageService,
    private fileUpl: FileUploadService,
    public dialogRef: MatDialogRef<AddBlogsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.isViewFlag = this.data?.label == 'View' ? true : false;
    this.defaultFrm();
  }

  defaultFrm() {
    this.blogForm = this.fb.group({
      id: [this.data ? this.data.id : 0],
      title: [this.data ? this.data.title : '',[Validators.required, this.validator.maxLengthValidator(100)]],
      thumbnailImage: [this.data ? this.data.thumbnailImage : '',[Validators.required]],
      publishDate: [new Date()],
      status: [this.data ? this.data.status : true],
      description: [this.data ? this.data.description : '',[Validators.required]],
      flag: [this.data ? "u" : "i"]
    })
    this.imageResponse = this.data ? this.data.thumbnailImage : ''
  }
  viewMsgFlag:boolean=false;
  onSubmit() {
     let formvalue = this.blogForm.value;
     if (this.blogForm.invalid) {
        this.viewMsgFlag=true;
       return;
     }
      else {  
       formvalue.thumbnailImage = this.imageResponse; 

       let mainData ={...formvalue, "createdBy": this.webStorage.getUserId() }  ;
       
       this.apiService.setHttp('POST', 'sericulture/api/Blogs/save-update-blogs?lan='+this.lang, false, mainData, false, 'masterUrl');
       this.apiService.getHttp().subscribe({
         next: ((res: any) => {
          this.spinner.hide();
           if (res.statusCode == '200') {
             
             this.common.snackBar(res.statusMessage, 0);  
             this.dialogRef.close('Yes');   
             this.viewMsgFlag=false; 
           } else {
             
             this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
           }
         }),
         error: (() => { this.spinner.hide(); })
       })
     }
   }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jpeg').subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.imageResponse = res.responseData;
          this.f['thumbnailImage'].setValue(this.imageResponse)
        }
        else {
          this.clearlogo.nativeElement.value = "";
          this.imageResponse = "";
        }
      }),
      error: (error: any) => {
        this.clearlogo.nativeElement.value = "";
        this.imageResponse = "";
        this.spinner.hide();
        this.common.checkDataType(error.status) == false ? this.errorService.handelError(error.statusCode) : this.common.snackBar(error.statusText, 1);
      }
    })
  }

  viewimage() {
    window.open(this.imageResponse, '_blank')
  }

  deleteImage() {
    this.imageResponse = "";
    this.f['thumbnailImage'].setValue(this.imageResponse)
    this.clearlogo.nativeElement.value = "";
  }

  clearFormData() { // for clear Form field
    
    this.formDirective && this.formDirective?.resetForm();
    this.imageResponse = '';
    this.data = null;
    this.defaultFrm();
    this.viewMsgFlag=false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
