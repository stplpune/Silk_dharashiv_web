import { Component } from '@angular/core';
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

@Component({
  selector: 'app-silk-cocoon-sell-list',
  templateUrl: './silk-cocoon-sell-list.component.html',
  styleUrls: ['./silk-cocoon-sell-list.component.scss']
})
export class SilkCocoonSellListComponent {




  pageNumber: number = 1;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';
  routingData:any;
  // farmerNameEn:any;
  // farmerNameMr:any;
  // beneficieryId :any;
  farmerId:any;

  constructor(public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    public common: CommonMethodsService,
    private errorService: ErrorHandlingService,
    public webStorage: WebStorageService,
    private activatedRoute: ActivatedRoute,
    public encryptdecrypt: AesencryptDecryptService) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log("parms", params);

      this.routingData = params['id'];
    })
     let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');
     console.log("spliteUrl",spliteUrl);
    //  this.beneficieryId = spliteUrl[0]; 
    //  this.farmerNameEn = spliteUrl[1];
    //  this.farmerNameMr =  spliteUrl[2];
     this.farmerId =  spliteUrl[3];
    this.getTableData();
  }


  getTableData() {
  let id = this.webStorage.getUserId()
    this.spinner.show();
    this.apiService.setHttp('GET', `sericulture/api/SilkSell/GetSilkSellDetails?FarmerId=${id}&Id=0&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData1;
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
    let displayedColumns = ['srNo', 'billNo', (this.lang == 'en' ? 'marketName' : 'm_MarketName'), 'totalSilk', 'silkRatePerKg', 'totalAmtWithMarktFees', 'silkSellDate', 'billPhoto', 'action']; //'action'
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Invoice No', 'Market Name', 'Quantity', 'Rate/Kg', 'Total Amount', 'Date', 'Invoice', 'Action'] : ['अनुक्रमांक', 'चलन क्र', 'बाजाराचे नाव', 'प्रमाण', 'दर/किलो', 'एकूण रक्कम', 'तारीख', 'चलन', 'कृती'];// 'पहा' 'view'

    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      pagination: this.tableDatasize > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,   
      edit : true, 
      view: true,    
      img: 'billPhoto',
      date: 'silkSellDate'
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Edit' :
        this.addsilkcacoon(obj)
        break;
      case 'Delete':
        // this.deleteDialogOpen(obj);
        break;
      case 'View':
        // this.silkselldetails(obj);
        break;
    }
  }

  
  // addsilkcacoon(){
  //   this.dialog.open(AddSilkCocoonSellComponent,{
  //     width:'50%'
  //   })
  // }


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


}
