import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { Router } from '@angular/router';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-crc-delivery-slabs',
  standalone: true,
  imports: [CommonModule, MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    GlobalTableComponent,
    NgxMatSelectSearchModule,
    TranslateModule],
  templateUrl: './crc-delivery-slabs.component.html',
  styleUrls: ['./crc-delivery-slabs.component.scss']
})
export class CrcDeliverySlabsComponent {
  slabForm!: FormGroup;
  statusArray = new Array();
  grainageArray = new Array();
  subscription!: Subscription;
  lang: string = 'English';
  tableDataArray: any;
  tableDatasize!: number;
  totalPages!: number;
  highLightedFlag: boolean = true;
  filterFlag: boolean = false;
  pageNumber: number = 1;
  id: any;
  grainageCtrl: FormControl = new FormControl();
  grainageSubject: ReplaySubject<any> = new ReplaySubject<any>();
  constructor
    (
      private fb: FormBuilder,
      private masterService: MasterService,
      public WebStorageService: WebStorageService,
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private commonMethod: CommonMethodsService,
      private errorHandler: ErrorHandlingService,
      private route: Router,

  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    });
    this.id = this.route.url.split('=')[1];
    this.getFormData();
    this.searchDataZone();
    this.getStatus();
    this.getGrainage();
    this.getTableData();
  }

  searchDataZone() {
    this.grainageCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.grainageArray, this.grainageCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.grainageSubject) });
  }

  getFormData() {
    this.slabForm = this.fb.group({
      grainageId: [0],
      statusId: [0]
    })
  }

  getGrainage() {
    this.masterService.GetGrainageWithTypeandState().subscribe({
      next: ((res: any) => {
        this.grainageArray = res.responseData;
        this.grainageArray.unshift({ id: 0, textEnglish: 'All Grainage', textMarathi: 'सर्व धान्य' }),
          this.commonMethod.filterArrayDataZone(this.grainageArray, this.grainageCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.grainageSubject);
      }), error: (() => {
        this.grainageArray = [];
      })
    })
  }

  getStatus() {
    this.masterService.getCRCStatus().subscribe({
      next: ((res: any) => {
        this.statusArray = res.responseData;
      }), error: (() => {
        this.statusArray = [];
      })
    })
  }

  getTableData(flag?: any) {
    this.spinner.show();
    let formData = this.slabForm.getRawValue();
    flag == 'filter' ? this.pageNumber = 1 : ''
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/CRC-Centers_Delivery-Slab?Id=27&Status='+(formData.statusId || 0)+'&GrainageId='+(formData.grainageId || 0)+str, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;          
          this.tableDatasize = res.responseData.responseData2?.totalCount;
          this.totalPages = res.responseData.responseData2?.totalPages;
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
    let displayedColumns = this.lang == 'en' ? ['srNo', 'deliverySlab', 'grainage', 'capacity_DFL', 'rate_Silkworm', 'startDate', 'endDate', 'status', 'action']
      : ['srNo', 'deliverySlab', 'm_Grainage', 'capacity_DFL', 'rate_Silkworm', 'startDate', 'endDate', 'm_Status', 'action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Delivery Slab', 'Grainage', 'Capacity (DFL)', 'Rate/100DFLs', 'Start Date', 'End Date', 'Status', 'Action'] :
      ['अनुक्रमांक', 'डिलिव्हरी स्लॅब', 'धान्य', 'क्षमता (DFL)', 'दर/100DFLs', 'प्रारंभ तारीख', 'शेवटची तारीख', 'स्थिती', 'कृती'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      isBlock: '',
      date: 'startDate',
      dates:'endDate',
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view: true,
      edit: false,
      delete: false
    };
    this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;
    console.log('tableDatatableData',tableData);
    
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? this.getFormData() : ''
        this.getTableData();
        break;
      // case 'View':
      //   this.viewCRCList(obj);
      //   break;
      // case 'Block':
      //   this.openBlockDialog(obj);
      //   break;
    }
  }

  clearFormData() {
    this.pageNumber = 1;
    this.getFormData();
    this.getTableData();
  }
}
