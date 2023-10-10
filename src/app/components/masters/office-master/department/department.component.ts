import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent {
  departmentFrm!: FormGroup;
  filterFrm!: FormGroup;
  editFlag: boolean = false;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  pageNumber: number = 1;
  highLightRowFlag: boolean = false;
  searchDataFlag: boolean = false
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  @ViewChild('formDirective') private formDirective!: NgForm;
  get f() { return this.departmentFrm.controls };
  get fl() { return this.filterFrm.controls };

  constructor(private fb: FormBuilder,
    private spinner: NgxSpinnerService,
      public validator: ValidationService,
      private apiService: ApiService,
      private errorService: ErrorHandlingService,
      private common: CommonMethodsService,
      public dialog: MatDialog,
      public webStorage: WebStorageService
      ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
       this.setTableData();
    })
    this.defaultFrm();
    this.filterDefaultFrm();
    this.getTableData();
  }

  defaultFrm(data?: any) { 
    this.departmentFrm = this.fb.group({
      id : [data ? data.id : 0],
      departmentName: [data ? data.departmentName : '', [Validators.required, Validators.pattern(this.validator.fullName),Validators.maxLength(30)]],
      m_DepartmentName: [data ? data.m_DepartmentName : '',[Validators.required, Validators.pattern(this.validator.marathi),Validators.maxLength(30)]],
      createdBy: [0]
    })
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      textSearch: [''],
    })
  }

  getTableData(status?: any) {
    this.spinner.show();
    status == 'filter' ? ((this.pageNumber = 1), this.defaultFrm(),this.searchDataFlag = true) : '';
    let str = `&pageNo=${this.pageNumber}&pageSize=10`;
    let searchValue = this.filterFrm?.value || '';
    this.apiService.setHttp('GET', 'sericulture/api/Department/get-All-Department?'+str+'&TextSearch=' + (searchValue.textSearch || ''), false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.totalPages = res.responseData1?.totalPages;
          this.tableDatasize = res.responseData1?.totalCount;
     } else {
          this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : '';
          this.spinner.hide();
          this.tableDataArray = [];
          this.tableDatasize = 0;
        }
        this.setTableData();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err.status);
      },
    });
  }

  setTableData() {
    this.highLightRowFlag = true;
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'departmentName', 'm_DepartmentName', 'action'] : ['srNo', 'departmentName','m_DepartmentName', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'विभाग(इंग्रजी)', 'विभाग(मराठी)','कृती'] : ['Sr. No.', 'Department(English)','Department(Marathi)','ACTION'];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      img: '',
      blink: '',
      badge: '',
      isBlock: '',
      pagination: this.tableDatasize > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      edit: true,
      delete: true,
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.editFlag = false;
        this.clearFormData();
        this.searchDataFlag ? (this.fl['textSearch'].setValue(this.filterFrm.value.textSearch)) : (this.fl['textSearch'].setValue(''));
        this.getTableData();
        break;
      case 'Edit':
        this.editFlag = true
        this.onEditData(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
    }
  }

  onSubmitData() {
    let formvalue = this.departmentFrm.value;
    if(this.departmentFrm.invalid){
      return
    }else{
      this.spinner.show();
      this.apiService.setHttp('POST','sericulture/api/Department/Insert-Update-Department', false, formvalue, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res:any) => {
          if(res.statusCode == '200'){
            this.common.snackBar(res.statusMessage,0);
            this.clearFormData(); 
            this.defaultFrm();
            this.filterFrm.controls['textSearch'].setValue('');
            this.getTableData(); 
            this.editFlag = false;   
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

  globalDialogOpen(delDataObj?: any) {
    let dialogObj = {
      title: 'Do You Want To Delete Department?',
      header: 'Delete',
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
        this.apiService.setHttp('DELETE', 'sericulture/api/Department/DeleteDepartment?Id=' + (delDataObj.id || 0), false, delDataObj, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.common.snackBar(res.statusMessage, 0);
              this.getTableData();
              this.clearFormData();
              this.editFlag = false;
            } else {
              this.common.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorService.handelError(error.status);
          },
        });
      }
      this.highLightRowFlag = false;
    });
  }

  onEditData(receiveObj: any) {
    this.editFlag = true;
    this.defaultFrm(receiveObj);
  }

  clearSearchFilter() {  // for clear search field
    this.filterFrm.reset();
    this.filterDefaultFrm();
    this.getTableData();
    this.pageNumber=1;
    this.searchDataFlag = false;
  }

  clearFormData() { // for clear Form field    
    this.editFlag = false;
    this.formDirective?.resetForm();
    this.defaultFrm();
  }

}