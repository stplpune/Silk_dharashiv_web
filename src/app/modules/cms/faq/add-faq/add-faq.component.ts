import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent {
  faqFrm!: FormGroup;
  isViewFlag : boolean = false;
  @ViewChild('formDirective') private formDirective!: NgForm;
  subscription!: Subscription;
  lang: any;
  get f() { return this.faqFrm.controls };

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public dialog: MatDialog,
    public webStorage: WebStorageService,
    public dialogRef: MatDialogRef<AddFaqComponent>,
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
    this.faqFrm = this.fb.group({
      id: [this.data ? this.data.id : 0],
      question: [this.data ? this.data.question : '', [Validators.required,Validators.pattern(this.validator.fullNamequetion), this.validator.maxLengthValidator(200)]],
      m_Question: [this.data ? this.data.m_Question : '', [Validators.required,Validators.pattern(this.validator.marathiquestion), this.validator.maxLengthValidator(200)]],
      answer: [this.data ? this.data.answer : '', [Validators.required,Validators.pattern(this.validator.fullNamequetion), this.validator.maxLengthValidator(1000)]],
      m_Answer: [this.data ? this.data.m_Answer : '', [Validators.required,Validators.pattern(this.validator.marathiquestion), this.validator.maxLengthValidator(1000)]],
      status: [this.data ? this.data.status : true],
      flag: [this.data ? "u" : "i"]
    })
  }

  onSubmitData() {
    let formvalue = this.faqFrm.value;
    if (this.faqFrm.invalid) {
      return
    } else {
      this.spinner.show();
      formvalue.id = Number(formvalue.id)
      let mainData = { ...formvalue, "createdBy": this.webStorage.getUserId() };
      this.apiService.setHttp('POST', 'sericulture/api/FAQ/save-update-faq?lan='+ this.lang, false, mainData, false, 'masterUrl');
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

  clearFormData() { // for clear Form field
    this.formDirective?.resetForm();
    this.data = null;
    this.defaultFrm();
  }
}
