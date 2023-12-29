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
import { ChowkiOrderDetailsComponent } from './chowki-order-details/chowki-order-details.component';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { ActivatedRoute } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-beneficiery-order-history',
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
  templateUrl: './beneficiery-order-history.component.html',
  styleUrls: ['./beneficiery-order-history.component.scss']
})
export class BeneficieryOrderHistoryComponent {

  pageNumber: number = 1;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';
  routingData:any;
  farmerNameEn:any;
  farmerNameMr:any;
  beneficieryId :any;
  farmerId:any;
 
  constructor(
    public webStorage: WebStorageService,
    public common: CommonMethodsService,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorHandlingService,
    public dialog:MatDialog,
    private activatedRoute: ActivatedRoute,
    public encryptdecrypt: AesencryptDecryptService
  ) { 
  //   let Id: any;
  //   this.activatedRoute.queryParams.subscribe((queryParams: any) => { Id = queryParams['id'] });
  //   if(Id){
  //     this.beneficieryId =  this.encryptdecrypt.decrypt(`${decodeURIComponent(Id)}`)  
  // }
  }
  ngOnInit() {

    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })   
    this.activatedRoute.queryParams.subscribe((params:any)=>{
      this.routingData = params['id'];
     })
     let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');
     this.beneficieryId = spliteUrl[0]; 
     this.farmerNameEn = spliteUrl[1];
     this.farmerNameMr =  spliteUrl[2];
     this.farmerId =  spliteUrl[3];
    this.getTableData();
  }


  getTableData(_status?: any) {
    this.spinner.show();       
    this.apiService.setHttp('GET', 'sericulture/api/Beneficiery/GetBeneficieryChawkiOrder?FarmerId='+( this.farmerId)+'&pageno=1&pagesize=10&lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;          
          this.totalPages = res.responseData.responseData2.totalPages;
          this.tableDatasize = res.responseData.responseData2.totalCount;
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
    let displayedColumns = ['srNo', 'orderId', (this.lang == 'en' ? 'crcName' : 'm_CRCName'),(this.lang == 'en' ? 'grainage' : 'm_Grainage'),(this.lang == 'en' ? 'type' : 'm_Type'),'totalChawkiRequest','totalAmount','orderDate','status','action']; //'action'
    let displayedheaders = this.lang == 'en' ? ['Sr. No.','Order Id', 'CRC Name', 'Grainage','Type','Quantity','Amount','Order Date','Status','Action'] : ['अनुक्रमांक', 'ऑर्डर आयडी','सीआरसीचे नाव','धान्य', 'प्रकार','प्रमाण','रक्कम','मागणीची तारीख','स्थिती','कृती'];// 'पहा' 'view'

    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      pagination: this.tableDatasize > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view: true,
      track: false,
      edit: false,
      date: 'orderDate' 
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'View':
        this.chowkiorderdetails(obj);
        break;
    }
  }

  chowkiorderdetails(obj?:any){ 
    let dialogRef = this.dialog.open(ChowkiOrderDetailsComponent,{
      width: "80%",
      data : obj,
      disableClose: true,
      autoFocus: false,
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getTableData();
    });
  }





}
