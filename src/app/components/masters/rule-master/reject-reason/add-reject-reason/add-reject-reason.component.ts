import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { RejectReasonComponent } from '../reject-reason.component';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-reject-reason',
  templateUrl: './add-reject-reason.component.html',
  styleUrls: ['./add-reject-reason.component.scss']
})
export class AddRejectReasonComponent {
  rejectResonFrm!: FormGroup;
  actionResp = new Array();
  lang: any;
  editFlag: boolean = false;
  subscription!: Subscription;//used  for lang conv
  @ViewChild('formDirective') private formDirective!: NgForm;
  constructor(private master: MasterService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethods: CommonMethodsService,
    private error: ErrorHandlingService,
    private webStorage: WebStorageService,
    public validation:ValidationService,
    public dialogRef: MatDialogRef<RejectReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.defaultForm();
    this.getAction();
    this.data?.label == 'Edit' ? this.editData() : '';
  }

  defaultForm() {
    this.rejectResonFrm = this.fb.group({
      actionId: ['', [Validators.required]],
      rejectionTitle: ['', [Validators.required,Validators.pattern(this.validation.englishNumericAndspecialChar),this.validation.maxLengthValidator(100)]],
      rejectionTitleMarathi:['', [Validators.required,this.validation.maxLengthValidator(100),Validators.pattern(this.validation.marathi)]],
      description: ['', [Validators.required,this.validation.maxLengthValidator(500)]],
    })
  }

  get f(){
   return this.rejectResonFrm.controls;
  }

  getAction() {
    this.master.GetActionDropDown().subscribe({
      next: ((res: any) => {
        this.actionResp = res.responseData;
      }), error: (() => {
        this.actionResp = [];
      })
    })
  }

  onSubmit() {
    if (this.rejectResonFrm.invalid) {
      return;
    }
    this.spinner.show();
    let formData = this.rejectResonFrm.getRawValue();
    let obj = {
      "id":this.editFlag?this.data?.id: 0,
      "actionId": formData.actionId,
      "rejectionTitle": formData.rejectionTitle,
      "m_RejectionTitle":formData.rejectionTitleMarathi,
      "rejectionDescription": formData.description,
      "createdBy": this.webStorage.getUserId(),
      "flag": this.editFlag?"u":"i"
    }
    this.apiService.setHttp('post', 'sericulture/api/ Reject Reasons/Insert-Update-Reject-Reasons', false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.formDirective?.resetForm();
          this.dialogRef.close('Yes');
        } else {
          this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.error.handelError(error.statusCode);
      }
    });
  }

  editData() {
    this.editFlag = true;
    this.rejectResonFrm.patchValue({
      actionId:this.data.actionId,
      rejectionTitle:this.data.rejectionTitle,
      rejectionTitleMarathi:this.data.m_RejectionTitle,
      description:this.data.rejectionDescription,
    })
  }

  clearForm() {
    this.formDirective?.resetForm();
    this.editFlag = false;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
