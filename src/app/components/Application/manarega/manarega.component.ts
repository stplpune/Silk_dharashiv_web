import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-manarega',
  templateUrl: './manarega.component.html',
  styleUrls: ['./manarega.component.scss']
})
export class ManaregaComponent {
  filterFrm!: FormGroup;
  schemeFilterArr = new Array();
  districtArr  = new Array();
  talukaArr  = new Array();
  grampanchayatArray  = new Array();
  statusArr = new Array();
  actionArr= new Array();
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  pageNumber: number = 1;
  highLightRowFlag: boolean = false;
  searchDataFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';
  get f() { return this.filterFrm.controls };
  displayedColumns: string[] = ['srno', 'applicationid', 'farmername', 'mobileno','taluka','village','date','status','action'];
  dataSource = ELEMENT_DATA;


  constructor(private fb: FormBuilder,
    private master: MasterService,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public webStorage: WebStorageService,
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.filterDefaultFrm();this.getAllScheme();
    this.getDisrict(); this.getStatus();this.getAction();
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      schemeTypeId: [0],
      districtId: [this.webStorage.getDistrictId()],
      talukaId: [0],
      grampanchayatId:[0],
      statusId:[0],
      actionId:[0],
      textSearch: [''],
    })
  }

  getAllScheme() {
    this.schemeFilterArr = [];
    this.master.GetAllSchemeType().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.schemeFilterArr.unshift({ id: 0, textEnglish: "All Scheme", textMarathi: "सर्व योजना" }, ...res.responseData);
        } else {
          this.schemeFilterArr = [];
        }
      },
    });
  }

  getDisrict() {
    this.districtArr = [];
    this.master.GetAllDistrict(this.webStorage.getStateId()).subscribe({
      next: ((res: any) => {
        this.districtArr= res.responseData;
        this.getTaluka();
      }), error: (() => {
        this.districtArr = [];
      })
    })
  }
 
  getTaluka() {
    this.talukaArr = [];
    let distId = this.filterFrm.getRawValue().districtId;
    this.master.GetAllTaluka(this.webStorage.getStateId(), distId, 0,).subscribe({
      next: ((res: any) => {
        this.talukaArr.unshift({ id: 0, textEnglish: "All Taluka", textMarathi: "सर्व तालुका" }, ...res.responseData);
        this.getGrampanchayat();
      }), error: (() => {
        this.talukaArr = [];
      })
    })
  }

  getGrampanchayat() {
    this.grampanchayatArray = [];
    let talukaId = this.filterFrm.getRawValue().talukaId;
    if (talukaId != 0) {
      this.master.GetGrampanchayat(talukaId || 0).subscribe({
        next: ((res: any) => {
          this.grampanchayatArray.unshift({ id: 0, textEnglish: "All Grampanchayat", textMarathi: "सर्व ग्रामपंचायत" }, ...res.responseData);
        }), error: (() => {
          this.grampanchayatArray = [];
        })
      })
    }
  }

  getStatus() {
    this.statusArr = [];
    this.master.GetApprovalStatus().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.statusArr =res.responseData;
        } else {
          this.statusArr = [];
        }
      },
    });
  }

  getAction() {
    this.actionArr = [];
    this.master.GetActionDropDown().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.actionArr =res.responseData;
        } else {
          this.actionArr = [];
        }
      },
    });
  }

  getTableData(status?: any) {
    this.spinner.show();
    let formData = this.filterFrm.getRawValue();
    status == 'filter' ? ((this.pageNumber = 1),  this.searchDataFlag = true) : '';
    let str = `&pageNo=${this.pageNumber}&pageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/GrainageModel/Get-Grainage-Details?Type='+ (formData?.type || 0)+'&StateId='+(formData?.stateId || 0)+'&SearchText='+(formData.textSearch.trim() || '')+str+'&lan=', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;
          this.totalPages = res.responseData.responseData2?.totalPages;
          this.tableDatasize = res.responseData.responseData2?.totalCount;
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_Type', 'm_Grainage', 'm_State', 'm_District', 'action'] : ['srNo', 'type', 'grainage', 'state', 'district', 'action'];						
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'अर्ज आयडी', 'शेतकऱ्याचे नाव', 'मोबाईल क्र.', 'तालुका','गाव','तारीख','स्थिती', 'कृती'] : ['Sr. No.','Application ID', 'Farmer Name', 'Mobile No.', 'Taluka','Village','Date','Status', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      pagination: this.tableDatasize > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view:  true,
      edit: true,
      delete: true,
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  clearDropdown(dropdown: string) {
    if (dropdown == 'Taluka') {
      this.f['grampanchayatId'].setValue(0);;
      this.grampanchayatArray = [];
    }
  }

  clearSearchFilter() {  // for clear search field
    this.filterFrm.reset();
    this.filterDefaultFrm();
    this.getTableData();
    this.pageNumber = 1;
    this.searchDataFlag = false;
    this.grampanchayatArray = [];
  }


}
export interface PeriodicElement {
  srno: number;
  applicationid: string;
  farmername: string;
  mobileno: string;
  taluka:string;
  village:string;
  date:string;
  status:string;
  action:any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, applicationid: 'MR0008576253', farmername: 'Jayaram Ramesh Tandale', mobileno: '8669264767', taluka:'Havelli',village:'Nagar', date:'25-10-2023', status:'Pending', action:'View' }
];
