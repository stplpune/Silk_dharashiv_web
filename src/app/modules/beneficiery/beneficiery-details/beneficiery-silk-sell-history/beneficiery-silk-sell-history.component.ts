import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { SilkSellDetailsComponent } from './silk-sell-details/silk-sell-details.component';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-beneficiery-silk-sell-history',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    GlobalTableComponent
  ],
  templateUrl: './beneficiery-silk-sell-history.component.html',
  styleUrls: ['./beneficiery-silk-sell-history.component.scss']
})
export class BeneficierySilkSellHistoryComponent {

  pageNumber: number = 1;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';

  constructor(public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    public common: CommonMethodsService,
    private errorService: ErrorHandlingService,
    public webStorage: WebStorageService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log("parms", params);

      // this.routingData = params['id'];
    })
    //  let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');
    //  this.beneficieryId = spliteUrl[0]; 
    //  this.farmerNameEn = spliteUrl[1];
    //  this.farmerNameMr =  spliteUrl[2];
    //  this.farmerId =  spliteUrl[3];
    this.getTableData();
  }


  getTableData() {
    this.spinner.show();
    this.apiService.setHttp('GET', `sericulture/api/SilkSell/GetSilkSellDetails?FarmerId=2&Id=0&lan=en`, false, false, false, 'masterUrl');
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
      delete: true,
      view: true,
      track: false,
      edit: false,
      img: 'billPhoto',
      date: 'silkSellDate'
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Delete':
        // this.deleteDialogOpen(obj);
        break;
      case 'View':
        this.silkselldetails(obj);
        break;
    }
  }

  silkselldetails(obj: any) {
    this.dialog.open(SilkSellDetailsComponent, {
      width: "90%",
      data: obj.id
    })
  }
}
