import { Component, OnDestroy } from '@angular/core';
import {  FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { AddSchemeComponent } from './add-scheme/add-scheme.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})
export class SchemesComponent implements OnDestroy{

  totalCount: number | any;
  tableDataArray = new Array();
  tableObj: object | any;
  highLightedFlag: boolean = true;
  pageNumber: number = 1;
  filterForm = new FormControl('');
  filtarFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';
  pageAccessObject: object|any;

  constructor
    (
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private errorService: ErrorHandlingService,
      private commonMethodService: CommonMethodsService,
      private WebStorageService: WebStorageService,
      public dialog: MatDialog,
      public validator: ValidationService,

  ) { }

  addscheme(data?: any) {
    const dialogRef = this.dialog.open(AddSchemeComponent, {
      width: '40%',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.getTableData() : '';
    })
  }

  ngOnInit() {
    this.WebStorageService.getAllPageName().filter((ele:any) =>{return ele.pageName == "Schemes" ? this.pageAccessObject = ele :''})
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.getTableData();
  }



  getTableData(flag?: any) {
    let searchValue = this.filterForm.value || ''
    flag == 'filter' ? (this.pageNumber = 1) : '';
    this.apiService.setHttp('GET', 'sericulture/api/Scheme/get-All-Scheme?PageNo=' + this.pageNumber + '&PageSize=10&TextSearch=' + searchValue, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.show();
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.tableDataArray = res.responseData;
          this.totalCount = res.responseData1.totalCount;
        } else {
          this.spinner.hide();
          this.tableDataArray = [];
          this.totalCount = 0;
          // this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
        }
        this.setTableData();
      }),
      error: (err: any) => {
        this.spinner.hide();
        this.tableDataArray = [];
        this.totalCount = 0;
        this.errorService.handelError(err.status)
      }
    })
  }

  setTableData() {
    this.highLightedFlag = true;
    let displayedColumns = this.lang == 'en' ? ['srNo', 'schemeType', 'state', 'district', 'isActive', 'action'] : ['srNo', 'm_SchemeType', 'm_State', 'm_District', 'isActive', 'action']
    let tableHeaders = this.lang == 'en' ? ['Sr. No.', 'Scheme', 'State', 'District', 'Status', 'Action'] : ['अनुक्रमांक', 'योजना', 'राज्य', 'जिल्हा', 'स्थिती', 'क्रिया']
    this.tableObj = {
      pageNumber: this.pageNumber,
      status: '',
      isBlock: 'isActive',
      tableData: this.tableDataArray,
      tableSize: this.totalCount,
      tableHeaders: tableHeaders,
      displayedColumns: displayedColumns,
      pagination: this.totalCount > 10 ? true : false,
      view: this.pageAccessObject?.readRight == true ? true: false,
      edit: this.pageAccessObject?.writeRight == true ? true: false,
      delete: this.pageAccessObject?.deleteRight == true ? true: false,
      reset: false,
    }
    this.highLightedFlag ? this.tableObj.highlightedrow = true : this.tableObj.highlightedrow = false;
    this.apiService.tableData.next(this.tableObj);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filtarFlag ? this.filterForm.reset() : ''
        this.getTableData();
        break;
      case 'Edit':
        this.addscheme(obj);
        break;
        case 'View':
        this.addscheme(obj);
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
      case 'Block':
        this.openBlockDialog(obj);
        break;

    }
  }

  openBlockDialog(obj?: any) {
    let userEng = obj.isActive == false ? 'Active' : 'Deactive';
    let userMara = obj.isActive == false ? 'ब्लॉक' : 'अनब्लॉक';
    let dialoObj = {
      header: this.lang == 'mr-IN' ? 'योजना ' + userMara + ' करा' : userEng + ' Scheme',
      title: this.lang == 'mr-IN' ? 'तुम्ही निवडलेली योजना ' + userMara + ' करू इच्छिता ?' : 'Do You Want To ' + userEng + ' The Selected Scheme ?',
      cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
      okButton: this.lang == 'mr-IN' ? 'ओके' : 'Ok',
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.blockScheme(obj) : '';
    })
  }

  blockScheme(obj: any) {
    let status = !obj.isActive
    this.apiService.setHttp('PUT', 'sericulture/api/Scheme/ActiveInactiveScheme?Id=' + obj.id + '&IsActive=' + status, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? (this.commonMethodService.snackBar(res.statusMessage, 0), this.getTableData()) : this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
      },
      error: (error: any) => {
        this.errorService.handelError(error.status);
        this.commonMethodService.checkDataType(error.status) == false ? this.errorService.handelError(error.status) : this.commonMethodService.snackBar(error.status, 1);
      }
    })
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'en' ? 'Do You Want To Delete Selected Scheme ?' : 'तुम्हाला निवडलेली योजना हटवायची आहे का ?',
      header: this.lang == 'en' ?  'Delete Scheme' : 'योजना हटवा',
      okButton: this.lang == 'en' ?  'Delete' : 'हटवा',
      cancelButton:this.lang == 'en' ?  'Cancel' : 'रद्द करा',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('delete', 'sericulture/api/Scheme/DeleteScheme?Id=' + delObj.id, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethodService.snackBar(res.statusMessage, 0);
              this.getTableData();
            } else {
              this.commonMethodService.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorService.handelError(error.statusCode);
          },
        });
      }
      this.highLightedFlag = false;
    });
  }



  clearFilter() {
    this.filterForm.reset();
    this.getTableData();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
