import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-crc-list',
  templateUrl: './crc-list.component.html',
  styleUrls: ['./crc-list.component.scss']
})
export class CRCListComponent {
  crcForm!:FormGroup;
  districtArray = new Array();
  talukaArray = new Array();
  statusArray = new Array();
  subscription!: Subscription;
  lang: string = 'English';
  pageNumber: number = 1;
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  tableDataArray: any;
  tableDatasize!: number;
  totalPages!: number;
  highLightedFlag: boolean = true;

  constructor
  (
    private fb:FormBuilder,
    private masterService: MasterService,
    private commonMethod: CommonMethodsService,
    public WebStorageService: WebStorageService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private errorHandler: ErrorHandlingService,
    public validation:ValidationService
  ) {}

  ngOnInit(){
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getFormData();
    this.searchDataZone();
    this.getDisrict();
    // this.getStatus();
  }

  getFormData(){
    this.crcForm=this.fb.group({
      districtId: [this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],
      talukaId: [ this.WebStorageService.getTalukaId() == '' ? 0 : this.WebStorageService.getTalukaId()],
      statusId:[''],
      searchValue:[''],
    })
  }

  get f() { return this.crcForm.controls}

  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
  }

  getDisrict(){
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

  getTaluka(){
    this.talukaArray = [];
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
      }), error: (() => {
        this.talukaArray = [];
        this.talukaSubject.next(null);
      })
    })
  }

  // getStatus(){
  //   this.talukaArray = [];
  //   this.masterService.getCrcStatus().subscribe({
  //     next: ((res: any) => {
  //       this.statusArray = res.responseData;
  //     }), error: (() => {
  //       this.statusArray = [];
  //     })
  //   })
  // }


  getTableData(flag?: any) {
    this.spinner.show();
    let formData = this.crcForm.value;    
    flag == 'filter' ? this.pageNumber = 1 : ''
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    console.log(formData,str);
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/Get-CRC-Center-List' + this.lang, false, false, false, 'masterUrl');
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
    let displayedColumns = this.lang == 'en' ? ['srNo', 'name', 'departmentName', 'departmentLevel', 'designationName', 'mobNo1', 'emailId','activeStatus','action']
      : ['srNo', 'm_Name', 'm_DepartmentName', 'm_DepartmentLevel', 'm_DesignationName', 'mobNo1', 'emailId','activeStatus','action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Officer Name', 'Department', 'Department Level', 'Designation', 'Mobile No.', 'Email','Account Status', 'Action'] :
      ['अनुक्रमांक', 'अधिकाऱ्याचे नाव', 'विभाग', 'विभाग स्तर', 'पदनाम', 'मोबाईल नंबर', 'ईमेल','खाते स्थिती','कृती'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      isBlock: '',
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view:true,
      edit:false,
      delete:false
    };
    this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.getTableData();
        break;
      case 'View':
        // this.registerofficer(obj);
        break;
    }
  }
}
