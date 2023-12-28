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

@Component({
  selector: 'app-beneficiery-application-history',
  standalone: true,
  imports: [CommonModule,GlobalTableComponent],
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

  constructor(
    // private master: MasterService,
    public webStorage: WebStorageService,
    public common: CommonMethodsService,
    // public encryptdecrypt: AesencryptDecryptService,
    // private router: Router,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorHandlingService,
  ) { }
  ngOnInit() {

    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })   
    this.getTableData();
  }


  childCompInfo(obj?: any) {
    switch (obj.label) {
      // case 'Pagination':
      //   this.pageNumber = obj.pageNumber;
      //   this.getTableData();
      //   break;
      case 'View':
        // this.viewBenificiaryList(obj);
        break;
    }
  }

  getTableData(_status?: any) {
    this.spinner.show();    
    this.apiService.setHttp('GET', `sericulture/api/Beneficiery/GetBeneficieryApplicationsHistory?FarmerId=1&lan=en`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
  
          
          // this.totalPages = res.responseData1.totalPages;
          // this.tableDatasize = res.responseData1.totalCount;
        } else {
          this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : '';
          this.spinner.hide();
          this.tableDataArray = [];
          // this.tableDatasize = 0;
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
    let displayedColumns = ['srNo', 'applicationNo', (this.lang == 'en' ? 'schemeType' : 'm_SchemeType'), (this.lang == 'en' ? 'departmentName' : 'm_DepartmentName'),'applicationDate']; //'action'
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Application Id', 'Scheme Name', 'Process Department', 'Date'] : ['अनुक्रमांक', 'अर्ज आयडी', 'योजनेचे नाव', 'प्रक्रिया विभाग','दिनांक'];// 'पहा' 'view'

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

}
