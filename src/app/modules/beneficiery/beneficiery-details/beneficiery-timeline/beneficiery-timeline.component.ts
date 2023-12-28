import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';

@Component({
  selector: 'app-beneficiery-timeline',
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
  templateUrl: './beneficiery-timeline.component.html',
  styleUrls: ['./beneficiery-timeline.component.scss']
})
export class BeneficieryTimelineComponent {
  
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
    this.apiService.setHttp('GET', `sericulture/api/Beneficiery/GetBeneficieryTimeline?FarmerId=1&pageno=1&pagesize=10&lan=en`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;
          console.log("tableDataArray",this.tableDataArray);          
          this.totalPages = res.responseData.responseData2.totalPages;
          this.tableDatasize = res.responseData.responseData2.totalCount;
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
    let displayedColumns = ['srNo', 'postImages', (this.lang == 'en' ? 'postData' : 'm_PostData'),'likes','shares','action']; //'action'
    let displayedheaders = this.lang == 'en' ? ['Sr. No.','Image', 'Description', 'Likes', ' Views','Share','Action'] : ['अनुक्रमांक', 'प्रतिमा','वर्णन','पसंती', 'शेअर करा','कृती'];// 'पहा' 'view'

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
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

}
