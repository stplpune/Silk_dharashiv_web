import { Component, Inject } from '@angular/core';
import {   MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  orderdetail:any;
  qtyDetails:any;
  constructor
  (
    public dialogRef: MatDialogRef<GrainageOrderDetailsComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
    private commonMethod: CommonMethodsService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private errorHandler: ErrorHandlingService,
    public webService: WebStorageService,

  ) {}

  ngOnInit(){
    this.subscription = this.webService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    });
    this.getTableData();
  }

 

  getTableData() {
    this.spinner.show();
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/Get-Gainage-Order-Details?OrderId='+this.data?.OrderId, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {          
          this.tableDataArray = res.responseData.responseData3;  
          this.orderdetail=  res.responseData.responseData1;
          this.qtyDetails=  res.responseData.responseData2;
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

  // "srNo": 2,
  // "invoiceNo": "bill123",
  // "deliveryDate": "2023-10-12T13:29:02.09",
  // "quantity": 2000,
  // "lotNo": "lot2019",
  // "race": 1,
  // "ledDate": "2023-10-12T07:56:30.267",
  // "hatchingDate": "2023-10-12T07:56:30.267",
  // "totalAmount": 1000,
  // "deliveryCharge": 100,
  // "discount": 10,
  // "finalAmount": 1090,
  // "invoice": "string",
  // "raceType": "A.H",
  // "m_RaceType": "ए.एच"
  
  setTableData() {
    this.highLightedFlag = true;
    let displayedColumns = this.lang == 'en' ? 
    ['srNo', 'invoiceNo', 'deliveryDate', 'quantity','lotNo', 'race', 'ledDate','hatchingDate','rate','totalAmount','deliveryCharge','discount','finalAmount','invoice']
  :['srNo', 'invoiceNo', 'deliveryDate', 'quantity','lotNo', 'm_RaceType', 'ledDate','hatchingDate','rate','totalAmount','deliveryCharge','discount','finalAmount','invoice'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Invoice No', 'Delivery Date', 'Quantity(DFLs)','Lot No','Race','Led Date','Hatching Date','Rate','Total Amount', 'Delivery Charge','Discount','Final Amount','Invoice'] :
      ['अनुक्रमांक','चलन क्रमांक', 'वितरण तारीख', 'प्रमाण','लॉट नंबर', 'वंशाचे नाव', 'नेतृत्व तारीख','उबवणुकीची तारीख','दर','एकूण रक्कम','वितरण शुल्क','दस्तऐवज','अंतिम रक्कम','चलन' ];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      isBlock: '',
      date: 'ledDate',
      dates:'hatchingDate',
      date2:'deliveryDate',
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
    }
  }

  viewreceipt(){
    window.open(this.orderdetail?.paymentReceipt)
  }


}
