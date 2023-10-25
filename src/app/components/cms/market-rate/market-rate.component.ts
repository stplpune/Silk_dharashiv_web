import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddMarketRateComponent } from './add-market-rate/add-market-rate.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-market-rate',
  templateUrl: './market-rate.component.html',
  styleUrls: ['./market-rate.component.scss']
})
export class MarketRateComponent {
  filterForm !: FormGroup
  pageNumber: number = 1;
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  tableDataArray = new Array();
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  filterFlag: boolean = false;
  marketArr = new Array();
  goodsArr = new Array();
  pageAccessObject: object | any;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    private errorHandler: ErrorHandlingService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private WebStorageService: WebStorageService
  ) { }

  ngOnInit() {
    this.filterFormData();
    this.getTableData();
    this.getAllMarket();
    this.getFarmsGood();
    this.WebStorageService.getAllPageName().filter((ele: any) => { return ele.pageName == 'Department' ? this.pageAccessObject = ele : '' })
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
  }

  filterFormData() {
    this.filterForm = this.fb.group({
      "marketId": [''],
      "goodId": [''],
      "fromDate": [''],
      "toDate": ['']
    })
  }

  getAllMarket() {
    this.apiService.setHttp('get', 'sericulture/api/DropdownService/get-MarketCommittee', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.marketArr = res.responseData
        } else {
          this.marketArr = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorHandler.handelError(err.statusCode) })
    });
  }

  getFarmsGood() {
    this.apiService.setHttp('get', 'sericulture/api/DropdownService/get-FarmGoods', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.goodsArr = res.responseData
        } else {
          this.goodsArr = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorHandler.handelError(err.statusCode) })
    });
  }

  getTableData(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? (this.pageNumber = 1) : '';
    let fromDate = this.commonMethod.setDate(this.filterForm?.value?.fromDate)
    let toDate = this.commonMethod.setDate(this.filterForm?.value?.toDate)
    this.apiService.setHttp('GET', `sericulture/api/MarketPrice/Web_GetAllMarketRate?pageno=${this.pageNumber}&pagesize=10&MarketId=${this.filterForm?.value?.marketId || 0}&ShetmalId=${this.filterForm.value.goodId || 0}&FromDate=${fromDate || ''}&Todate=${toDate || ''}&lan=${this.lang}`, false, false, false, 'masterUrl');
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'marketRateDate', 'm_ShetmalCast', 'm_Unit', 'm_MarketName', 'minRate', 'maxRate', 'averageRate', 'income', 'action'] : ['srNo', 'marketRateDate', 'shetmalCast', 'unit', 'marketName', 'minRate', 'maxRate', 'averageRate', 'income', 'action']
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमणिका', 'तारीख', 'माल', 'एकक', 'बाजार', 'किमान दर', 'कमाल दर', 'सरासरी  दर', 'आवक', 'कृती'] : ['Sr.No', 'Date', 'Goods', 'Unit', 'Market', 'Min. Rate', 'Max. Rate', 'Avg. Rate', 'Income', 'Action'];
    let getTableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      date: 'marketRateDate',
      view: this.pageAccessObject?.readRight == true ? true : false,
      edit: this.pageAccessObject?.writeRight == true ? true : false,
      delete: this.pageAccessObject?.deleteRight == true ? true : false
    };
    this.highLightRowFlag ? (getTableData.highlightedrow = true) : (getTableData.highlightedrow = false);
    this.apiService.tableData.next(getTableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? this.filterFormData() : '';
        this.getTableData();
        break;
      case 'Edit':
        this.addMarket(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
      case 'View':
        this.addMarket(obj);
        break;
    }
  }

  globalDialogOpen(delDataObj?: any) {
    let dialogObj = {
      title: this.lang == 'mr-IN' ? 'तुम्हाला मार्केट रेट हटवायचा आहे का?' : 'Do You Want To Delete Market Rate?',
      header: this.lang == 'mr-IN' ? 'डिलीट करा' : 'Delete',
      okButton: this.lang == 'mr-IN' ? 'डिलीट' : 'Delete',
      cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialogObj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.apiService.setHttp('DELETE', `sericulture/api/MarketPrice/DeleteMarketRate?Id= ${(delDataObj.id || 0)}&lan=${this.lang}`, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.getTableData();
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

  addMarket(obj?: any) {
    const dialogRef = this.dialog.open(AddMarketRateComponent, {
      width: '30%',
      data: obj,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes' ? obj ? this.getTableData() : (this.pageNumber = 1, this.getTableData()) : '';
      this.highLightRowFlag = false;
      this.setTableData();
    });
  }

  clearFilter() {
    this.filterFormData();
    this.getTableData();
    this.pageNumber = 1
  }

}
