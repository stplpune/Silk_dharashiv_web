import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddSilkCocoonSellComponent } from './add-silk-cocoon-sell/add-silk-cocoon-sell.component';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ActivatedRoute } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-silk-cocoon-sell-list',
  templateUrl: './silk-cocoon-sell-list.component.html',
  styleUrls: ['./silk-cocoon-sell-list.component.scss']
})
export class SilkCocoonSellListComponent {
  filterForm !: FormGroup;
  pageNumber: number = 1;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';
  routingData: any;
  farmerId: any;
  filterFlag: boolean = false;
  marketCommitteeArr = new Array();
  maxDate = new Date();
  @ViewChild('formDirective') private formDirective!: NgForm;

  get f() { return this.filterForm.controls }

  constructor(public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    public common: CommonMethodsService,
    private errorService: ErrorHandlingService,
    public webStorage: WebStorageService,
    private activatedRoute: ActivatedRoute,
    public encryptdecrypt: AesencryptDecryptService,
    private fb: FormBuilder,
    private commonMethod: CommonMethodsService,
    public validator: ValidationService,
    private dateAdapter: DateAdapter<Date>
  ) { this.dateAdapter.setLocale('en-GB') }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.routingData = params['id'];
    })
    let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');;
    this.farmerId = spliteUrl[3];
    this.filterFormData();
    this.getMarketCommittee();
    this.getTableData();
  }

  filterFormData() {
    this.filterForm = this.fb.group({
      BillNo: [''],
      MarketCommiteeId: [''],
      FromDate: [''],
      ToDate: ['']
    })
  }

  getTableData(flag?: any) {
    let formValue = this.filterForm.value;
    let id = this.webStorage.getUserId()
    this.spinner.show();
    let fromDate = this.commonMethod.setDate(this.filterForm?.getRawValue()?.fromDate)
    let toDate = this.commonMethod.setDate(this.filterForm?.getRawValue()?.toDate)
    flag == 'filter' ? this.pageNumber = 1 : ''
    this.apiService.setHttp('GET', `sericulture/api/SilkSell/GetSilkSellDetails?FarmerId=${id}&Id=0&BillNo=${formValue.BillNo || ''}&MarketCommiteeId=${formValue.MarketCommiteeId || 0}&FromDate=${fromDate || ''}&ToDate=${toDate || ''}&pageno=${this.pageNumber}&pagesize=10&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData1;
          this.tableDatasize = res.responseData2.totalCount;
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
    let displayedColumns = ['srNo', 'billNo', (this.lang == 'en' ? 'marketName' : 'm_MarketName'), 'totalSilk', 'silkRatePerKg', 'totalAmtWithMarktFees', 'silkSellDate', 'billPhoto', 'action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Invoice No', 'Market Name', 'Quantity', 'Rate/Kg', 'Total Amount', 'Date', 'Invoice', 'Action'] : ['अनुक्रमांक', 'चलन क्र', 'बाजाराचे नाव', 'प्रमाण', 'दर/किलो', 'एकूण रक्कम', 'तारीख', 'चलन', 'कृती'];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      pagination: this.tableDatasize > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      edit: true,
      view: true,
      delete: true,
      img: 'billPhoto',
      date: 'silkSellDate'
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? this.formDirective.resetForm() : ''
        this.getTableData();
        this.filterFormData();
        break;
      case 'Edit':
        this.addsilkcacoon(obj)
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
      case 'View':
        this.addsilkcacoon(obj);
        break;
    }
  }

  addsilkcacoon(obj?: any) {
    let dialogRef = this.dialog.open(AddSilkCocoonSellComponent, {
      width: '50%',
      data: obj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.getTableData() : '';
      this.highLightRowFlag = false;
    });
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'en' ? 'Do You Want To Delete Selected Silk Cocoon?' : 'तुम्हाला निवडलेले सिल्क कोकून हटवायचे आहे का?',
      header: this.lang == 'en' ? 'Delete Silk Cocoon' : 'सिल्क कोकून हटवा',
      okButton: this.lang == 'en' ? 'Delete' : 'हटवा',
      cancelButton: this.lang == 'en' ? 'Cancel' : 'रद्द करा',
      headerImage: 'assets/images/delete.svg'
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('delete', `sericulture/api/SilkSell/DeleteSilkSellRecord?Id=${delObj?.id}&lan=${this.lang}`, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.common.snackBar(res.statusMessage, 0);
              this.getTableData();
            } else {
              this.common.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorService.handelError(error.statusCode);
          },
        });
      }
      this.highLightRowFlag = false;
    });
  }

  getMarketCommittee() {
    this.apiService.setHttp('GET', `sericulture/api/DropdownService/get-MarketCommittee?lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.marketCommitteeArr = res.responseData;
        }
      },
      error: (err: any) => {
        this.errorService.handelError(err.status);
      },
    });
  }

  clearFilter() {
    this.formDirective.resetForm();
    this.pageNumber = 1;
    this.filterFormData();
    this.getTableData();
  }
}
