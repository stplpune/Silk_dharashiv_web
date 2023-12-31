import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-grainage-order-details',
  templateUrl: './grainage-order-details.component.html',
  styleUrls: ['./grainage-order-details.component.scss']
})
export class GrainageOrderDetailsComponent {
  tableDataArray: any;
  tableDatasize!: number;
  totalPages!: number;
  highLightedFlag: boolean = true;
  subscription!: Subscription;
  lang: string = 'English';
  pageNumber: number = 1;
  orderdetail: any;
  qtyDetails: any;
  constructor
    (
      public dialogRef: MatDialogRef<GrainageOrderDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
      private commonMethod: CommonMethodsService,
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private errorHandler: ErrorHandlingService,
      public webService: WebStorageService,

  ) { }

  ngOnInit() {    
    this.subscription = this.webService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.getTableData();
  }



  getTableData() {
    this.spinner.show();
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/Get-Gainage-Order-Details?OrderId='+this.data.orderId, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData3;
          this.orderdetail = res.responseData.responseData1;
          this.qtyDetails = res.responseData.responseData2;
          this.tableDatasize = res;
          this.totalPages = res;
        } else {
          this.spinner.hide();
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
    this.highLightedFlag = true;
    let displayedColumns = this.lang == 'en' ?
      ['srNo', 'invoiceNo', 'deliveryDate', 'quantity', 'lotNo', 'raceType', 'ledDate', 'hatchingDate', 'rate', 'totalAmount', 'deliveryCharge', 'discount', 'finalAmount','action']
      : ['srNo', 'invoiceNo', 'deliveryDate', 'quantity', 'lotNo', 'm_RaceType', 'Release Date', 'hatchingDate', 'rate', 'totalAmount', 'deliveryCharge', 'discount', 'finalAmount','action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Invoice No', 'Delivery Date', 'Quantity (DFLs)', 'Lot No', 'Race', 'Release Date', 'Hatching Date', 'Rate', 'Total Amount', 'Delivery Charge', 'Discount', 'Final Amount', 'Invoice', 'Invoice'] :
      ['अनुक्रमांक', 'चलन क्रमांक', 'वितरण तारीख', 'प्रमाण', 'लॉट नंबर', 'जात', 'प्रकाशन तारीख', 'उबवणुकीची तारीख', 'दर', 'एकूण रक्कम', 'वितरण शुल्क', 'दस्तऐवज', 'अंतिम रक्कम','चलन'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      isBlock: '',
      date: 'ledDate',
      dates: 'hatchingDate',
      date2: 'deliveryDate',
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view: true,
      edit: false,
      delete: false
    };
    this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'View':
        this.viewInvoice(obj)
        break;
    }
  }


  viewInvoice(data?: any) {
    window.open(data?.invoice)
  }

  viewreceipt() {
    window.open(this.orderdetail?.paymentReceipt)
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


}
