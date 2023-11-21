import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.scss']
})
export class AddActionComponent {
  actionFrm!: FormGroup;
  schemeArray = new Array();
  @ViewChild('formDirective') private formDirective!: NgForm;
  get f() { return this.actionFrm.controls };
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  isViewFlag : boolean = false;

  constructor(private fb: FormBuilder,
    private master: MasterService,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public dialog: MatDialog,
    public webStorage: WebStorageService,
    public dialogRef: MatDialogRef<AddActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.isViewFlag = this.data?.label == 'View' ? true : false; //for View Functionality
    this.defaultFrm();
    if (!this.isViewFlag) {
      this.getAllScheme();
    }
  }

  defaultFrm() {
    this.actionFrm = this.fb.group({
      id: [this.data ? this.data.id : 0],
      actionName: [this.data ? this.data.actionName : '', [Validators.required, Validators.pattern(this.validator.englishNumericAndspecialChar), this.validator.maxLengthValidator(50)]],
      m_ActionName: [this.data ? this.data.m_ActionName : '', [Validators.required, Validators.pattern(this.validator.marathiquestion), this.validator.maxLengthValidator(50)]],
      schemeTypeId: [this.data ? this.data.schemeTypeId : '', Validators.required],
      description: [this.data ? this.data.description : '',this.validator.maxLengthValidator(500)],
      flag: [this.data ? "u" : "i"]
    })
  }

  getAllScheme() {
    this.schemeArray = [];
    this.master.GetAllSchemeType().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.schemeArray = res.responseData;
        } else {
          this.schemeArray = [];
        }
      },
    });
  }

  onSubmitData() {
    let formvalue = this.actionFrm.value;
    if (this.actionFrm.invalid) {
      return
    } else {
      this.spinner.show();
      formvalue.id = Number(formvalue.id)
      let mainData = {...formvalue,"createdBy":this.webStorage.getUserId()};
      this.apiService.setHttp('POST', 'sericulture/api/Action/Insert-Update-Action?lan='+this.lang, false, mainData, false, 'masterUrl');
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
