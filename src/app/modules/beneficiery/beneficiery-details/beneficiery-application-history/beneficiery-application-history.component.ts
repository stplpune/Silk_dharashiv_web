import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
// import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { ActivatedRoute } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { BeneficiaryAppViewDetailsComponent } from './beneficiary-app-view-details/beneficiary-app-view-details.component';

@Component({
  selector: 'app-beneficiery-application-history',
  standalone: true,
  imports: [CommonModule,GlobalTableComponent,MatCardModule],
  templateUrl: './beneficiery-application-history.component.html',
  styleUrls: ['./beneficiery-application-history.component.scss']
})
export class BeneficieryApplicationHistoryComponent {

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
    private activatedRoute: ActivatedRoute,
    public encryptdecrypt: AesencryptDecryptService,
    public dialog: MatDialog,

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
    this.apiService.setHttp('GET', 'sericulture/api/Beneficiery/GetBeneficieryApplicationsHistory?FarmerId='+(this.farmerId)+'&lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
        } else {
          this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : '';
          this.spinner.hide();
          this.tableDataArray = [];
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
    let displayedColumns = ['srNo', 'applicationNo', (this.lang == 'en' ? 'schemeType' : 'm_SchemeType'), (this.lang == 'en' ? 'departmentName' : 'm_DepartmentName'),'applicationDate','status','action']; //'action'
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Application Id', 'Scheme Name', 'Process Department', 'Date','Status','Action'] : ['अनुक्रमांक', 'अर्ज आयडी', 'योजनेचे नाव', 'प्रक्रिया विभाग','दिनांक','स्थिती','क्रिया'];// 'पहा' 'view'

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
      date: 'applicationDate'
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }


  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'View':
        this.viewBenificiaryList(obj);
        break;
    }
  }

  viewBenificiaryList(obj?:any){
    let dialogRef = this.dialog.open(BeneficiaryAppViewDetailsComponent, {
      width: '100%',
      data: obj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe(() => {

    });
  }


}
