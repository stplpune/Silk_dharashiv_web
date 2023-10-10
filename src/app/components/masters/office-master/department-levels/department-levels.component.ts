import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';


@Component({
  selector: 'app-department-levels',
  templateUrl: './department-levels.component.html',
  styleUrls: ['./department-levels.component.scss']
})
export class DepartmentLevelsComponent {
  departmentLevelForm !: FormGroup;
  departmentArray = new Array();
  departmentLevelArray = new Array();
  filterDeptArray = new Array();
  filterDeptLevelArray = new Array();
  editFlag: boolean = false;
  filterDepartment = new FormControl(0);
  filterDeptLevel = new FormControl(0);
  tableDataArray = new Array();
  pageNumber: number = 1;
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;

  get f() { return this.departmentLevelForm.controls }
  @ViewChild('FormGroupDirective') private FormGroupDirective!: NgForm;
  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.formData();
    this.getTableData();
    this.getDepartment();
    this.getDepartmentLevel();
  }
  formData(editObj?: any) {
    this.departmentLevelForm = this.fb.group({
      "id": [editObj?.id || 0],
      "departmentId": [editObj?.departmentId || '', Validators.required],
      "departmentLevelId": [editObj?.departmentLevelId || '', Validators.required],
      "createdBy": 0
    })
  }

  getTableData(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? (this.pageNumber = 1) : '';
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    // https://demosilkapi.mahamining.com/sericulture/api/DepartmentLevel/get-All-DepartmentLevel?DeptId=0&DeptlevelId=0&PageNo=1&PageSize=10
    this.apiService.setHttp('GET', `sericulture/api/DepartmentLevel/get-All-DepartmentLevel?DeptId=${this.filterDepartment.value || 0}&DeptlevelId=${this.filterDeptLevel.value || 0}` + str, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.tableDatasize = res.responseData1?.totalCount;
          this.totalPages = res.responseData1?.totalPages;

        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : '';
          this.tableDataArray = []; this.tableDatasize = 0;
        }
        this.setTableData();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status);
      },
    });
  }

  setTableData() {
    this.highLightRowFlag = true;
    let displayedColumns = ['srNo', 'departmentName', 'deptLevel', 'action'];
    let displayedheaders = ['Sr. No.', 'Department Name', 'Level', 'Action'];
    let getTableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      delete: true, view: false, edit: true,
    };
    this.highLightRowFlag ? (getTableData.highlightedrow = true) : (getTableData.highlightedrow = false);
    this.apiService.tableData.next(getTableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.clearFilter();
        this.clearForm();
        this.getTableData();
        break;
      case 'Edit':
        this.formData(obj);
        this.editFlag = true;
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
    }
  }
  getDepartment() {
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        this.departmentArray = res.responseData;
        this.filterDeptArray = res.responseData;
      }),
      error: () => { this.departmentArray = []; this.filterDeptArray; }
    })
  }
  getDepartmentLevel() {
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        this.departmentLevelArray = res.responseData;
        this.filterDeptLevelArray = res.responseData;
      }),
      error: () => { this.departmentLevelArray = []; this.filterDeptLevelArray; }
    })
  }

  onSubmit() {
    let formvalue = this.departmentLevelForm.value;
    if (this.departmentLevelForm.invalid) {
      return
    } else {
      this.apiService.setHttp('POST', 'sericulture/api/DepartmentLevel/Insert-Update-DepartmentLevel', false, formvalue, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
            this.commonMethod.snackBar(res.statusMessage, 0);
            !this.editFlag ? this.pageNumber = 1 : this.pageNumber = this.pageNumber
           this.clearForm()
           this.clearFilter();
            this.getTableData();
          } else {
            this.spinner.hide();
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (() => { this.spinner.hide(); })
      })
    }
  }

  globalDialogOpen(delDataObj?: any) {
    let dialogObj = {
      title: 'Are you sure you want to delete Department Level?',
      header: 'Delete Department Level',
      okButton: 'Delete',
      cancelButton: 'Cancel',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialogObj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.apiService.setHttp('DELETE', 'sericulture/api/DepartmentLevel/DeleteDepartmentLevel?Id=' + (delDataObj.id || 0), false, delDataObj, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.getTableData();
              this.clearForm();             
              this.editFlag = false;
            } else {
              this.commonMethod.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorHandler.handelError(error.status);
          },
        });
      }
      this.highLightRowFlag = false;
    });
  }
  clearForm() {
    this.formData();
    this.FormGroupDirective && this.FormGroupDirective.resetForm();
    this.editFlag = false;
  }
  clearFilter() {
    this.filterDepartment.value || this.filterDeptLevel.value ? (this.filterDepartment.setValue(0), this.filterDeptLevel.setValue(0), this.getTableData()) : '';
  }
}

