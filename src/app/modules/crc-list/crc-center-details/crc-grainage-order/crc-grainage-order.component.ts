import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GrainageOrderDetailsComponent } from './grainage-order-details/grainage-order-details.component';
import { ReplaySubject, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MasterService } from 'src/app/core/services/master.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { GlobalTableComponent } from "../../../../shared/components/global-table/global-table.component";
import { ActivatedRoute } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-crc-grainage-order',
  standalone: true,
  templateUrl: './crc-grainage-order.component.html',
  styleUrls: ['./crc-grainage-order.component.scss'],
  imports: [CommonModule, MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule, GlobalTableComponent]
})
export class CrcGrainageOrderComponent {

  districtArray = new Array();
  stateArray = new Array();
  subscription!: Subscription;
  lang: string = 'English';
  filterForm!: FormGroup;
  statusArray = new Array();
  tableDataArray: any;
  tableDatasize!: number;
  totalPages!: number;
  highLightedFlag: boolean = true;
  filterFlag: boolean = false;
  pageNumber: number = 1;
  counterObject: any;
  districtCtrl: FormControl = new FormControl();
  districtPSubject: ReplaySubject<any> = new ReplaySubject<any>();
  stateCtrl: FormControl = new FormControl();
  stateSubject: ReplaySubject<any> = new ReplaySubject<any>();
  routingData: any;
  id: any;
  crcNameMR: any;
  crcNameEn: any;
  constructor
    (
      public dialog: MatDialog,
      public webService: WebStorageService,
      private fb: FormBuilder,
      private commonMethod: CommonMethodsService,
      private masterService: MasterService,
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private errorHandler: ErrorHandlingService,
      public validation: ValidationService,
      private route: ActivatedRoute,
      public encryptdecrypt: AesencryptDecryptService,
  ) { }

  ngOnInit() {
    this.subscription = this.webService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.route.queryParams.subscribe((queryParams: any) => {
      this.routingData = queryParams['id'];
    });
    let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');;
    this.id = spliteUrl[0];
    this.crcNameEn = spliteUrl[1];
    this.crcNameMR = spliteUrl[2];
    this.getFormData();
    this.getState();
    this.getStatus();
    this.searchDataZone();
    this.getTableData();
  }

  getFormData() {
    this.filterForm = this.fb.group({
      stateId: [0],
      districtId: [0],
      statusId: [0],
      searchValue: [''],
    })
  }
  get f() { return this.filterForm.controls; }

  searchDataZone() {
    this.stateCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.stateArray, this.stateCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.stateSubject) });
    this.districtCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.districtArray, this.districtCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.districtPSubject) });
  }

  getState() {
    this.masterService.getGrainageState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
        this.stateArray.unshift({ id: 0, textEnglish: 'All State', textMarathi: 'सर्व राज्य' }),
          this.commonMethod.filterArrayDataZone(this.stateArray, this.stateCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.stateSubject);
      }), error: (() => {
        this.stateArray = [];
        this.stateSubject.next(null);
      })
    })
  }

  getDisrict() {
    let formData = this.filterForm.getRawValue() || 0;
    this.districtArray = [];
    if (formData.stateId != 0) {
      this.masterService.geGrainageDistrict(formData.stateId).subscribe({
        next: ((res: any) => {
          this.districtArray = res.responseData;
          this.commonMethod.filterArrayDataZone(this.districtArray, this.districtCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.districtPSubject);
        }), error: (() => {
          this.districtArray = [];
        })
      })
    }
  }

  getStatus() {
    this.masterService.GetCRCChawkiStatus().subscribe({
      next: ((res: any) => {
        this.statusArray = res.responseData;
      }), error: (() => {
        this.statusArray = [];
      })
    })
  }

  grainageorderdetails(obj?: any) {
    let dialogRef = this.dialog.open(GrainageOrderDetailsComponent, {
      width: "100%",
      data: obj,
      disableClose: true,
      autoFocus: true,
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getTableData();
    });
  }

  //sericulture/api/CRCCenter/Get-Ordered-Grainage-List?crcCenterId=1&StateId=1&DistrictId=1&SearchText=q&PageNo=1&PageSize=10&lan=en

  getTableData(flag?: any) {
    this.spinner.show();
    let formData = this.filterForm.getRawValue();
    flag == 'filter' ? this.pageNumber = 1 : ''
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/Get-Ordered-Grainage-List?crcCenterId=' + (this.id) + '&Status=' + (formData.statusId || 0) + '&StateId='+(formData.stateId || 0)+'&DistrictId=' + (formData.districtId || 0) + '&TalukaId=' + (formData.talukaId || 0) + '&GrampanchyatId=' + (formData.grampanchayatId || 0) + '&SearchText=' + (formData.searchValue || '') + str, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData1;
          this.tableDataArray.map((ele: any) => {
            ele.status1 = (this.lang == 'en' ? ele.status : ele.m_Status);
          })
          this.counterObject = res.responseData;
          this.tableDatasize = res.responseData2?.totalCount;
          this.totalPages = res.responseData2?.totalPages;
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
    let displayedColumns = this.lang == 'en' ? ['srNo', 'orderId', 'grainage', 'state', 'grampanchayatName', 'type', 'orderedQty', 'orderDate', 'status1', 'action']
      : ['srNo', 'orderId', 'm_Grainage', 'm_state', 'm_GrampanchayatName', 'm_type', 'orderedQty', 'orderDate', 'status1', 'action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Order Id', 'Grainage', 'State', 'Location', 'Type', 'Order Qty (DFLs)', 'Order Date', 'Status', 'Action'] :
      ['अनुक्रमांक', 'ऑर्डर आयडी', 'धान्य', 'राज्य', 'स्थान', 'प्रकार', 'ऑर्डर प्रमाण (DFLs)', 'मागणीची तारीख', 'स्थिती', 'कृती'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      isBlock: '',
      date: 'orderDate',
      dates: '',
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
        !this.filterFlag ? this.getFormData() : ''
        this.getTableData();
        break;
      case 'View':
        this.grainageorderdetails(obj);
        break;
    }
  }

  clearFormData() {
    this.pageNumber = 1;
    this.getFormData();
    this.getTableData();
  }

  clearDropDown(flag: any) {
    if (flag == 'dist') {
      this.districtPSubject = new ReplaySubject<any>();
      this.districtArray = [];
      this.f['districtId'].setValue('');
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
