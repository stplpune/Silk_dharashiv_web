import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { MasterService } from 'src/app/core/services/master.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent {
 // displayedColumns: string[] = ['srno', 'departmentname','level','designation', 'action'];
 // dataSource:any;
 filterFrm !:FormGroup;
 pageNumber: number = 1;
 totalPages!: number;
 tableDataArray:any;
 tableDatasize!: number;
 highLightRowFlag: boolean = false;
departmentArray = new Array();
departmentLevelArray = new Array();

 constructor(private fb: FormBuilder,
private apiService: ApiService,
//public validation: ValidationService,
private masterService : MasterService,
private errorHandler : ErrorHandlingService,
private commonMethod : CommonMethodsService
 // public dialog: MatDialog,
 ) {}

 ngOnInit(){
  this.filterDefaultFrm();
  this.bindTable();
 }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      departmentId: [0],
      departmentLevelId: [0],
      designationName: ['']
    })
    this.getDepartment();
    this.getDepartmentLevel();
  }

  get f(){return  this.filterFrm.controls}

  bindTable(flag?: any) {
    //this.spinner.show();
    flag == 'filter' ? (this.pageNumber = 1) : '';
    let formData = this.filterFrm?.getRawValue();
     //flag == 'filter' ? this.clearMainForm() : '';
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', `sericulture/api/Designation/get-All-Designation?DeptId=${formData?.yearId || 0}&Deptlevel=${formData?.yearId || 0}` + str, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        //this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.tableDatasize = res.responseData.responseData1?.totalCount;
          this.totalPages = res.responseData.responseData1?.totalPages;
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : '';
          this.tableDataArray = []; this.tableDatasize = 0;
        }
        this.setTableData();
      },
      error: (err: any) => { 
       //this.spinner.hide(); 
        this.errorHandler.handelError(err.status); 
      },
    });
  }

  setTableData() {
    this.highLightRowFlag = true;
    let displayedColumns = ['srNo', 'departmentName', 'departmentLevel', 'designationName','action'];
    let displayedheaders = ['Sr. No.', 'Department Name', 'Department Level Name' , 'Designation Name' , 'Action'];
   let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
       tableHeaders: displayedheaders,
       delete: true, view:false, edit : true,
       };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  getDepartment() {
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentArray = res.responseData;
        }
        else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          this.departmentArray = [];
        }
      }), error: (error: any) => {
       this.errorHandler.handelError(error.statusCode)
      }
    })
  }

  getDepartmentLevel() {
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentLevelArray = res.responseData;
        }
        else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          this.departmentLevelArray = [];
        }
      }), error: (error: any) => {
       this.errorHandler.handelError(error.statusCode)
      }
    })
  }

  childCompInfo(obj: any) {
    console.log("obj",obj)
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.bindTable();
        break;
        case 'Edit':
           // this.openDialog(obj);
           // break;
      case 'Delete':
       // this.globalDialogOpen(obj);
       // break;
    }
  }

   }





