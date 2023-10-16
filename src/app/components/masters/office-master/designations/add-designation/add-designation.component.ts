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
  selector: 'app-add-designation',
  templateUrl: './add-designation.component.html',
  styleUrls: ['./add-designation.component.scss']
})
export class AddDesignationComponent {
  designationFrm !: FormGroup;
  departmentArray = new Array();
  departmentLevelArray = new Array();
  subscription!: Subscription;//used  for lang conv
  lang:any;
  editFlag: boolean = false;
  @ViewChild('formDirective') private formDirective!: NgForm;
  isViewFlag:boolean=false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public validation: ValidationService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    private WebStorageService: WebStorageService,
    private commonMethod: CommonMethodsService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddDesignationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(){
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
   this.isViewFlag = this.data?.label == 'View' ? true : false;
    if(!this.isViewFlag){
      this.getDepartment();
      this.getDepartmentLevel();
    }
   this.data ? this.onEditData(this.data) : this.addDefaultFrm();
  }

  
addDefaultFrm(data?: any) {
    this.designationFrm = this.fb.group({
      "id": [data ? data.id : 0],
      "designationName": [data ? data.designationName : '', [Validators.required, Validators.maxLength(50), Validators.pattern(this.validation.alphabetWithSpace)]],
      "m_DesignationName": [data ? data.m_DesignationName : '', [Validators.required, Validators.maxLength(50), Validators.pattern(this.validation.marathi)]],
      "departmentId": [data ? data.departmentId : '', [Validators.required]],
      "departmentLevelId": [data ? data.departmentLevelId : '', [Validators.required]],
    })
  }

  get a() { return this.designationFrm.controls }


  //#region ----------dropdown code start here-------------------------
  getDepartment() {
    this.departmentArray = [];
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentArray = res.responseData;
         }
        else {
          this.departmentArray = [];
        }
      })
    })
  }

  getDepartmentLevel() {
    this.departmentLevelArray = []; 
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentLevelArray = res.responseData;
         }
        else {
          this.departmentLevelArray = [];
         }
      })
    })
  }
  //#endregion-----------dropdown code end here-----------------

  onEditData(obj: any) {
    this.editFlag = true;
    this.addDefaultFrm(obj);
  }

  onSubmit() {
    if (this.designationFrm.invalid) {
      return;
    }
    else {
      this.spinner.show();
      let data = this.designationFrm.getRawValue();
      data.id = Number(data.id)
      let mainData = { ...data, "createdBy": this.WebStorageService.getUserId() };
      this.apiService.setHttp('post', 'sericulture/api/Designation/Insert-Update-Designation?lan=' + this.lang, false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
           this.clearMainForm();
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


   //clear add form functionality here
   clearMainForm() {
    this.formDirective?.resetForm();
    this.addDefaultFrm();
    this.editFlag = false;
  }





}
