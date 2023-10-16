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
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent {
  departmentFrm!: FormGroup;
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  @ViewChild('formDirective') private formDirective!: NgForm;
  get f() { return this.departmentFrm.controls };
  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public dialog: MatDialog,
    public webStorage: WebStorageService,
    public dialogRef: MatDialogRef<AddDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.defaultFrm();
  }

  defaultFrm() {
    this.departmentFrm = this.fb.group({
      id : [this.data ? this.data.id : 0],
      departmentName: [this.data ? this.data.departmentName : '', [Validators.required, Validators.pattern(this.validator.fullName),this.validator.maxLengthValidator(30)]],
      m_DepartmentName: [this.data ? this.data.m_DepartmentName : '',[Validators.required, Validators.pattern(this.validator.marathi),this.validator.maxLengthValidator(30)]],
    })
  }

  onSubmitData() {
    let formvalue = this.departmentFrm.value;
    if(this.departmentFrm.invalid){
      return
    }else{
      this.spinner.show();
      formvalue.id = Number(formvalue.id)
      let mainData = {...formvalue,"createdBy":this.webStorage.getUserId()};
      this.apiService.setHttp('POST','sericulture/api/Department/Insert-Update-Department', false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res:any) => {
          if(res.statusCode == '200'){
            this.spinner.hide();
             this.common.snackBar(res.statusMessage, 0);  
             this.dialogRef.close('Yes'); 
          }else{
            this.spinner.hide();
            this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.common.snackBar(res.statusMessage,1);
          }
        }),
        error :((error: any) => { this.spinner.hide()
          this.errorService.handelError(error.status) })
      })
    }
  }

  clearFormData() { // for clear Form field
    this.formDirective?.resetForm();
  }
}
