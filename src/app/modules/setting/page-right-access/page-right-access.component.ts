import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/services/master.service';
import { ApiService } from 'src/app/core/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
import { ValidationService } from 'src/app/core/services/validation.service';
@Component({
  selector: 'app-page-right-access',
  templateUrl: './page-right-access.component.html',
  styleUrls: ['./page-right-access.component.scss']
})
export class PageRightAccessComponent {
  displayedColumns: string[] = ['srno', 'module', 'submodule', 'pagename', 'read', 'write', 'delete', 'all'];
  filterFrm !: FormGroup;
  pageNumber: number = 1;
  totalPages!: number;
  dataSource: any;
  departmentArray = new Array();
  designationLevelArray = new Array();
  designationArray = new Array();
  moduleArray = new Array();
  subModuleArray = new Array();
  passArray: any[] = [];
  subscription!: Subscription;//used  for lang conv
  lang: any;
  userTypeArray: any[] = [{ "id": 1, "textEnglish": "Admin", "textMarathi": "प्रशासक" },
  { "id": 2, "textEnglish": "Other", "textMarathi": "इतर" }]
  // radioBtnValue:string = 'admin'
  //selectedText : string = 'admin'

  constructor(public dialog: MatDialog,
    public masterService: MasterService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private commonMethod: CommonMethodsService,
    private spinner: NgxSpinnerService,
    private webStorage: WebStorageService,
    public validation: ValidationService,
    private errorHandler: ErrorHandlingService) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getFilterForm();
    this.filterFrm.getRawValue()?.userTypeId == 1 ? this.getTableData() : '';
  }

  getFilterForm() {
    this.filterFrm = this.fb.group({
      userTypeId: [1],
      departmentId: [''],
      designationLevelId: [''],
      designationId: [''],
      searchText: ['']
    })
    this.getDepartment();
  }

  get a() { return this.filterFrm.controls }

  getTableData() {
    this.dataSource = [];
    let formData = this.filterFrm.getRawValue();
    // if (this.filterFrm.invalid && !formData.departmentId && !formData.designationLevelId && !formData.designationId) {
    //   return;
    // }
    // else {
    this.spinner.show();
    let str = `&pageno=${this.pageNumber}&pagesize=100`;
    let url = (formData.userTypeId == 1 ? `sericulture/api/UserPages/GetAllPageRights?DepartmentId=0&DepartmentLevelId=0&DesignationId=1&lan=${this.lang}&TextSearch=${formData?.searchText || ''}` : `sericulture/api/UserPages/GetAllPageRights?DepartmentId=${formData?.departmentId}&DepartmentLevelId=${formData?.designationLevelId}&DesignationId=${formData?.designationId}&lan=${this.lang}&TextSearch=${formData?.searchText || ''}`);
    this.apiService.setHttp('GET', url + str, false, false, false, 'baseUrl');
    //this.apiService.setHttp('GET', `sericulture/api/UserPages/GetAllPageRights?DepartmentId=${formData?.departmentId}&DepartmentLevelId=${formData?.designationLevelId}&DesignationId=${formData?.designationId}&lan=${this.lang}&TextSearch=${formData?.searchText || ''}` + str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.dataSource = res.responseData;
        } else {
          this.dataSource = [];
        }
      }),
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status)
      }
    })
    //}
  }

  searchData() {
    let formData = this.filterFrm.getRawValue();
    if (formData?.userTypeId == 2) {
      if (formData.departmentId != "" && formData.designationLevelId != "" && formData.designationId != "") {
        this.getTableData();
      }
      else {
        this.snackBarMsg();
      }
    }
    else {
      this.getTableData();
    }
  }

  selectRow(event: any, i: any) {
    let allStatus: any = event.checked ? true : false;
    this.dataSource[i].readRight = allStatus;
    this.dataSource[i].writeRight = allStatus;
    this.dataSource[i].deleteRight = allStatus;
  }

  onSubmitData() {
    this.spinner.show();
    let tableResponse = this.dataSource;
    tableResponse.map((res: any) => {
      let obj = {
        "id": res.id || 0,
        "designationId":this.filterFrm.getRawValue()?.userTypeId == 1 ?  1 : this.filterFrm.getRawValue().designationId,
        "pageId": res.pageId,
        "readRight": res.readRight,
        "writeRight": res.writeRight,
        "deleteRight": res.deleteRight,
        "createdBy": this.webStorage.getUserId(),
      }
      this.passArray.push(obj)
    })
    this.apiService.setHttp('post', 'sericulture/api/UserPages/AddUpdatePageRights?lan=' + this.lang, false, this.passArray, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.getTableData();
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }

  //clear filter form functionality here
  clearForm() {
    this.getFilterForm();
    this.getTableData();
  }


  //----------------- Dropdown code start here------------------------
  getDepartment() {
    let userType = this.filterFrm.getRawValue()?.userTypeId;
    console.log("userType", userType)
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData.length) {
          this.departmentArray = res.responseData;
        }
        else {
          this.departmentArray = [];
        }
      })
    })
  }

  getDesignationLevel() {
    this.designationLevelArray = [];
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData.length) {
          this.designationLevelArray = res.responseData;
             }
        else {
          this.designationLevelArray = [];
        }
      })
    })
  }

  getDesignation() {
    this.designationArray = [];
    let deptId = this.filterFrm.getRawValue().departmentId;
    let designationLevel = this.filterFrm.getRawValue().designationLevelId;
    this.masterService.GetDesignationDropDown(deptId, designationLevel).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData.length) {
          this.designationArray = res.responseData;
        }
        else {
          this.designationArray = [];
        }
      })
    })
  }
  //----------------- Dropdown code end here------------------------
  //clear dropdown on dependency wise
  clearDropdown(flag: any) {
    switch (flag) {
      case 'deptId':
        this.filterFrm.controls['designationLevelId'].setValue('');
        this.designationLevelArray = [];
        this.filterFrm.controls['designationId'].setValue('');
        this.designationArray = []
        break;
      case 'user':
        if (this.filterFrm.getRawValue()?.userTypeId == 2) {
          this.filterFrm.controls['designationLevelId'].setValue('');
          this.designationLevelArray = [];
          this.filterFrm.controls['designationId'].setValue('');
          this.designationArray = [];
        }
        else {
          this.getFilterForm();//when we select admin user type that time value patch 
        }
        break;
      case 'deptLevelId':
        this.filterFrm.controls['designationId'].setValue('');
        this.designationArray = []
        break;
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  snackBarMsg(){
    let formData = this.filterFrm.getRawValue();
    if(formData.departmentId != "" && formData.designationLevelId == "" && formData.designationId == ""){
      this.commonMethod.snackBar('Please Select Designation Level And Designation', 1);
      return;
      }
      else if(formData.departmentId != "" && formData.designationLevelId != "" && formData.designationId == ""){
        this.commonMethod.snackBar('Please Select Designation', 1);
        return;
      }
      else{
        this.commonMethod.snackBar('Please Select Department ,Designation Level And Designation', 1);
        return;
      }
  }

}
