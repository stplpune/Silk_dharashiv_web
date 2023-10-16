import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/services/master.service';
import { ApiService } from 'src/app/core/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
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

  constructor(public dialog: MatDialog,
    public masterService: MasterService,
    private apiService: ApiService,
    private fb:FormBuilder,
    private spinner:NgxSpinnerService,
    private errorHandler:ErrorHandlingService) { }

    ngOnInit(){
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
       departmentId : [0],
       designationLevelId : [0],
       designationId : [0],
       moduleId : [0],
       subModuleId : [0],
       searchText : ['']
      })
    }

 getTableData(){
    this.spinner.show();
    let formData=this.filterFrm.getRawValue();
    let str = `&pageno=${this.pageNumber}&pagesize=10`;
    this.apiService.setHttp('GET', `sericulture/api/UserPages/GetAllPageRights?DepartmentId=${formData?.departmentId || 0}&DepartmentLevelId=${formData?.designationLevelId || 0}&DesignationId=${formData?.designationId || 0}&MainMenuId=${formData?.moduleId || 0}&SubMenuId=${formData?.subModuleId || 0}&lan=en`+str, false, false, false, 'baseUrl');
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
  }

  selectRow(event : any , i : any){
    let allStatus: any = event.checked ? true : false;
    this.dataSource[i].readRight = allStatus;
    this.dataSource[i].writeRight = allStatus;
   }




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
    this.apiService.setHttp('get', 'sericulture/api/DropdownService/get-MainMenu', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
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
  this.apiService.setHttp('get', 'sericulture/api/DropdownService/get-SubMenu', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
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
