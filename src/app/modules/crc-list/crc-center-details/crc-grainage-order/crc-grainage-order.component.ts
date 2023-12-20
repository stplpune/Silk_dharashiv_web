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
  talukaArray = new Array();
  grampanchayatArray = new Array();
  subscription!: Subscription;
  lang: string = 'English';
  filterForm!: FormGroup;
  statusArray = new Array();
  slabArray = new Array();
  tableDataArray: any;
  tableDatasize!: number;
  totalPages!: number;
  highLightedFlag: boolean = true;
  filterFlag: boolean = false;
  pageNumber: number = 1;
  counterObject:any;
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>(); 
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  slabCtrl: FormControl = new FormControl();
  slabSubject: ReplaySubject<any> = new ReplaySubject<any>();

  constructor
  (
    public dialog:MatDialog,
    public webService: WebStorageService,
    private fb: FormBuilder,
    private commonMethod: CommonMethodsService,
    private masterService: MasterService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private errorHandler: ErrorHandlingService,
    public validation: ValidationService,
  ) {}

ngOnInit(){
  this.subscription = this.webService.setLanguage.subscribe((res: any) => {
    this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
    this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    this.setTableData();
  });
  this.getFormData();
  this.getDisrict();
  this.getStatus();
  this.getDistributionSlab();
  this.searchDataZone();
  this.getTableData();
}

getFormData() {
  this.filterForm = this.fb.group({
    districtId: [this.webService.getDistrictId() == '' ? 0 : this.webService.getDistrictId()],
    talukaId: [this.webService.getTalukaId() ? this.webService.getTalukaId() : 0],
    grampanchayatId: [0],
    statusId: [0],
    searchValue: [''],
    deliveryslabId:[0]
  })
}
get f() { return this.filterForm.controls; }

searchDataZone() {
  this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
  this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  this.slabCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.slabArray, this.slabCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.slabSubject) });
}

getDisrict() {
  this.districtArray = [];
  this.masterService.GetAllDistrict(1).subscribe({
    next: ((res: any) => {
      this.districtArray = res.responseData;
      this.getTaluka();
    }), error: (() => {
      this.districtArray = [];
    })
  })
}

getTaluka() {
  this.masterService.GetAllTaluka(1, 1, 0).subscribe({
    next: ((res: any) => {
      this.talukaArray = res.responseData;
      this.talukaArray.unshift({ id: 0, textEnglish: 'All Taluka', textMarathi: 'सर्व तालुका' }),
        this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
    }), error: (() => {
      this.talukaArray = [];
      this.talukaSubject.next(null);
    })
  })
}

getGrampanchayat() {
  let talukaId = this.filterForm.getRawValue().talukaId || 0;
  if (talukaId != 0) {
    this.masterService.GetGrampanchayat(talukaId).subscribe({
      next: ((res: any) => {
        this.grampanchayatArray = res.responseData;
        this.grampanchayatArray.unshift({ id: 0, textEnglish: 'All Grampanchayat', textMarathi: 'सर्व ग्रामपंचायत' });
        this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
      }), error: (() => {
        this.grampanchayatArray = [];
        this.gramPSubject.next(null);
      })
    })
  }
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

getDistributionSlab(){
  this.masterService.GetAllDistributionSlab().subscribe({
    next: ((res: any) => {
      this.slabArray = res.responseData;
      this.slabArray.unshift({ id: 0, textEnglish: 'All Delivery Slab', textMarathi: 'सर्व डिलिव्हरी स्लॅब' }),
      this.commonMethod.filterArrayDataZone(this.slabArray, this.slabCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.slabSubject);
    }), error: (() => {
      this.slabArray = [];
      this.slabSubject.next(null);
    })
  })
}

  grainageorderdetails(obj?:any){
    let dialogRef =this.dialog.open(GrainageOrderDetailsComponent,{
      width:"90%",
      data:obj
    })
    dialogRef.afterClosed().subscribe(() => {
      this.getTableData();
    });
  }
  // sericulture/api/CRCCenter/Get-CRC-Centers_Chawki-Orders?DistrictId='+(formData.districtId || 0)+'&TalukaId='+(formData.talukaId ||0)+'&GrampanchayatId='+(formData.grampanchayatId || 0)+'&DistributionSlab='+(formData.deliveryslabId || 0)+'&Status='+(formData.statusId || 0)+str

  getTableData(flag?: any) {
    this.spinner.show();
    let formData = this.filterForm.getRawValue(); 
    flag == 'filter' ? this.pageNumber = 1 : ''
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    console.log(formData,str);
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/Get-Ordered-Grainage-List?crcCenterId=27&Status=1', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {          
          this.tableDataArray = res.responseData.orderedGrainageLists; 
          this.tableDataArray.map((ele:any)=>{
            ele.status1 = (this.lang == 'en' ? ele.status : ele.m_Status) ;
          })       
          this.counterObject=res.responseData;
          this.tableDatasize = res.responseData.responseData3?.totalCount;
          this.totalPages = res.responseData.responseData3?.totalPages;
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
    let displayedColumns = this.lang == 'en' ? ['srNo', 'orderId', 'grainage', 'state','location', 'type', 'orderedQty','orderDate','status1','action']
      : ['srNo', 'orderId', 'm_Grainage', 'm_state','location', 'm_type', 'orderedQty','orderDate','status1','action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Order Id', 'Grainage', 'State','Location','Type','Order Qty(DFLs)','Order Date','Status', 'Action'] :
      ['अनुक्रमांक', 'ऑर्डर आयडी','धान्य','राज्य','स्थान','प्रकार','ऑर्डर प्रमाण (DFLs)','मागणीची तारीख','स्थिती','कृती'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      isBlock: '',
      date: 'orderDate',
      dates:'',
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

  clearFormData(){
    this.pageNumber = 1;
    this.getFormData();
    this.getTableData();
  }

  clearDropDown(flag: any) {
    if (flag == 'gram') {
      this.gramPSubject = new ReplaySubject<any>();
      this.grampanchayatArray = [];
      this.f['grampanchayatId'].setValue('');
    }
  }
}
