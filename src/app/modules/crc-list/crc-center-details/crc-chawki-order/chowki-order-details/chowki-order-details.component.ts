import { Component, Inject } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-chowki-order-details',
  templateUrl: './chowki-order-details.component.html',
  styleUrls: ['./chowki-order-details.component.scss']
})
export class ChowkiOrderDetailsComponent {
  tableDataArray:any;
  orderDataArray:any;
  subscription!: Subscription;
  lang: string = 'English';
  tableResDataArray:any;
  highLightedFlag: boolean = true;
  tblSize:any;
  totalCountData:any;
  constructor
  (
    public dialogRef: MatDialogRef<ChowkiOrderDetailsComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
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
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/Get-Chawki-Order-Details?OrderId=202310101', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.orderDataArray = res.responseData1
          this.tableResDataArray = res.responseData2; 
          this.totalCountData=res.responseData3;
          this.tblSize= this.tableResDataArray?.length;
        } else {
          this.spinner.hide();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : '';
          this.tableDataArray = [];
        }
        this.setTableData();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status);
      },
    });
  }

  viewreceipt(){
    window.open(this.tableDataArray.receiptOfPaymentPath)
  }

 
  setTableData() {
    this.highLightedFlag = true;
    let displayedColumns = this.lang == 'en' ? ['srNo', 'lotNumber', 'raceTypeId', 'quantity','ledDate', 'hatchingDate', 'deliveryDate']
      : ['srNo', 'lotNumber', 'raceTypeId', 'quantity','ledDate', 'hatchingDate', 'deliveryDate'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.','Lot No', 'Race', 'Quantity','Led Date', 'Hatching Date', 'Delivery Date'] :
      ['अनुक्रमांक', 'लॉट नंबर', 'रेस आयडी', 'प्रमाण', 'नेतृत्व तारीख', 'उबवणुकीची तारीख', 'वितरण तारीख'];
    let tableData = {
      pageNumber: 1,
      pagination: false,
      highlightedrow: true,
      isBlock: '',
      date: 'ledDate',
      dates:'hatchingDate',
      date2:'deliveryDate',
      displayedColumns: displayedColumns,
      tableData: this.tableResDataArray,
      tableSize:  this.tblSize,
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
        this.getTableData();
        break;
    }
  }
}
