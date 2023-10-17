import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/services/master.service';
import { ApiService } from 'src/app/core/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-page-right-access',
  templateUrl: './page-right-access.component.html',
  styleUrls: ['./page-right-access.component.scss']
})
export class PageRightAccessComponent {
  displayedColumns: string[] = ['srno','module','submodule', 'pagename', 'read', 'write', 'delete', 'all'];
  filterFrm !: FormGroup;
  pageNumber: number = 1;
  totalPages!: number;
  dataSource:any;
  departmentArray = new Array();
  designationLevelArray = new Array();
  designationArray = new Array();
  moduleArray = new Array();
  subModuleArray = new Array();
  passArray: any[] = [];
  subscription!: Subscription;//used  for lang conv
  lang:any;

  constructor(public dialog: MatDialog,
    public masterService: MasterService,
    private apiService: ApiService,
    private fb:FormBuilder,
    private commonMethod : CommonMethodsService,
    private spinner:NgxSpinnerService,
    private webStorage : WebStorageService,
    private errorHandler:ErrorHandlingService) { }

    ngOnInit(){
      this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
        this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
        this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      })
      this.getFilterForm();
      this.getDepartment();
       this.getDesignationLevel();
       this.getDesignation();
       this.getModule();
       this.getSubModule();
       this.getTableData();
     }

    getFilterForm(){
     this.filterFrm = this.fb.group({
       departmentId : ['',[Validators.required]],
       designationLevelId : ['',[Validators.required]],
       designationId : ['',[Validators.required]],
       moduleId : [0],
       subModuleId : [0],
       searchText : ['']
      })
    }

 getTableData(){
  let formData = this.filterFrm.getRawValue();
  if (this.filterFrm.invalid && !formData.designationId) {
    return;
  }
  else{
    this.spinner.show();
    let formData=this.filterFrm.getRawValue();
    let str = `&pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('GET', `sericulture/api/UserPages/GetAllPageRights?DepartmentId=${formData?.departmentId || 0}&DepartmentLevelId=${formData?.designationLevelId || 0}&DesignationId=${formData?.designationId || 0}&MainMenuId=${formData?.moduleId || 0}&SubMenuId=${formData?.subModuleId || 0}&lan=en`+str, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.dataSource = res.responseData;
           console.log(" this.dataSource page right", this.dataSource)
        } else {
          this.dataSource = [];
        }
      }),
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status)
      }
    })
  }
  }

  selectRow(event : any , i : any){
    let allStatus: any = event.checked ? true : false;
    this.dataSource[i].readRight = allStatus;
    this.dataSource[i].writeRight = allStatus;
    this.dataSource[i].deleteRight =  allStatus;
   }

   onSubmitData() {
    this.spinner.show();
    let tableResponse = this.dataSource;
    tableResponse.map((res: any) => {
      let  obj = {
          "id": res.id || 0,
          "designationId":this.filterFrm.getRawValue().designationId,
          "pageId": res.pageId,
          "readRight": res.readRight,
          "writeRight": res.writeRight,
          "deleteRight": res.deleteRight,
          "createdBy": this.webStorage.getUserId(),
        }
      this.passArray.push(obj)
    })
    this.apiService.setHttp('post', 'sericulture/api/UserPages/AddUpdatePageRights?lan=en', false, this.passArray, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.commonMethod.snackBar(res.statusMessage,0);
          this.getTableData();
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }


//----------------- Dropdown code start here------------------------
  getDepartment() {
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
    this.masterService.GetDesignationDropDown().subscribe({
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
 
  getModule() {
    this.masterService.GetModule().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData.length) {
          this.moduleArray = res.responseData;
        }
        else {
          this.moduleArray = [];
        }
      })
    })
  }
 
  getSubModule() {
    let moduleId = this.filterFrm.getRawValue().moduleId
   if(moduleId != 0){ 
    this.masterService.GetSubModule(moduleId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData.length) {
          this.subModuleArray = res.responseData;
        }
        else {
          this.subModuleArray = [];
        }
      })
    })
  }
  }
//----------------- Dropdown code end here------------------------

}