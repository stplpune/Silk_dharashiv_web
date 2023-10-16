import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { AddVillageComponent } from './add-village/add-village.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';

@Component({
  selector: 'app-village-circle',
  templateUrl: './village-circle.component.html',
  styleUrls: ['./village-circle.component.scss']
})
export class VillageCircleComponent {

  totalCount: number | any;
  tableDataArray = new Array();
  tableObj: object | any;
  highLightedFlag: boolean = true;
  pageNumber: number = 1;
  filterForm = new FormControl('');
  subscription!: Subscription;
  lang: string = 'English';
  filterFlag: boolean = false;

  constructor
    (
      public dialog: MatDialog,
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private errorService: ErrorHandlingService,
      private commonMethodService: CommonMethodsService,
      private WebStorageService: WebStorageService,
    ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.getTableData();
  }

  AddVillage(data?: any) {
    const dialogRef = this.dialog.open(AddVillageComponent, {
      width: '30%',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.getTableData() : '';
    })
  }

  getTableData(flag?: any) {
    let formValue = this.filterForm.value || ''
    this.spinner.show();
    flag == 'filter' ? this.pageNumber = 1 : ''
    this.apiService.setHttp('GET', 'sericulture/api/TalukaBlocks/GetAllVillageCircles?pageno=' + (this.pageNumber) + '&pagesize=10&TextSearch=' + formValue, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
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
    let tableHeaders = this.lang == 'en' ? ['Sr. No.', 'Circle Name', 'Action'] : ['अनुक्रमांक', 'मंडळाचे नाव', 'क्रिया'],
      displayedColumns = this.lang == 'en' ? ['srNo', 'circleName', 'action'] : ['srNo', 'm_CircleName', 'action']
    this.tableObj = {
      pageNumber: this.pageNumber,
      isBlock: '',
      status: '',
      tableHeaders: tableHeaders,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.totalCount,
      pagination: this.totalCount > 10 ? true : false,
      view: true,
      edit: true,
      delete: true,
      reset: false
    }
    this.highLightedFlag ? this.tableObj.highlightedrow = true : this.tableObj.highlightedrow = false;
    this.apiService.tableData.next(this.tableObj);
  }


  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? this.filterForm.reset() : '';
        this.getTableData();
        break;
      case 'Edit':
        this.AddVillage(obj);
        break;
      case 'View':
          this.AddVillage(obj);
          break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
    }
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'en' ? 'Do You Want To Delete Selected Circle ?' : 'तुम्हाला निवडलेले मंडळ हटवायचे आहे का ?',
      header: this.lang == 'en' ? 'Delete Village Circle' : 'मंडळ हटवा',
      okButton: this.lang == 'en' ? 'Delete' : 'हटवा',
      cancelButton: this.lang == 'en' ? 'Cancel' : 'रद्द करा',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('delete', 'sericulture/api/TalukaBlocks/DeleteVillageCircle?Id=' + delObj.id, false, false, false, 'masterUrl');
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
    this.pageNumber = 1;
    this.getTableData();
  }


}

