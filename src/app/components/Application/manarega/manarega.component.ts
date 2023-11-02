import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
@Component({
  selector: 'app-manarega',
  templateUrl: './manarega.component.html',
  styleUrls: ['./manarega.component.scss']
})
export class ManaregaComponent {
  filterFrm!: FormGroup;
  schemeFilterArr = new Array();
  districtArr = new Array();
  talukaArr = new Array();
  grampanchayatArray = new Array();
  statusArr = new Array();
  actionArr = new Array();
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  pageNumber: number = 1;
  highLightRowFlag: boolean = false;
  searchDataFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';
  get f() { return this.filterFrm.controls };
  displayedColumns: string[] = ['srno', 'applicationid', 'farmername', 'mobileno', 'taluka', 'village', 'date', 'status', 'action'];


  constructor(private fb: FormBuilder,
    private master: MasterService,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public webStorage: WebStorageService,
    public encryptdecrypt: AesencryptDecryptService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.filterDefaultFrm(); this.getTableData(); this.getAllScheme();
    this.getDisrict(); this.getStatus(); this.getAction();
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      schemeTypeId: [0],
      districtId: [this.webStorage.getDistrictId()],
      talukaId: [0],
      grampanchayatId: [0],
      statusId: [0],
      // actionId: [0],
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
        this.districtArr = res.responseData;
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
          this.statusArr.unshift({ id: 0, textEnglish: "All Status", textMarathi: "सर्व स्थिती" }, ...res.responseData);
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
          this.actionArr.unshift({ id: 0, textEnglish: "All Action", textMarathi: "सर्व कृती" }, ...res.responseData);
        } else {
          this.actionArr = [];
        }
      },
    });
  }

  getTableData(status?: any) {
    this.spinner.show();
    let formData = this.filterFrm.getRawValue();
    status == 'filter' ? ((this.pageNumber = 1), this.searchDataFlag = true) : '';
    let str = `&pageNo=${this.pageNumber}&pageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetAllDesignationWiseApplications?' + str + '&SchemeTypeId=' + (formData.schemeTypeId || 0) + '&DistrictId=' + (formData.districtId || 0) + '&TalukaId=' + (formData.talukaId || 0) + '&GrampanchayatId=' + (formData.grampanchayatId || 0) +
    '&ApplicationStatus=' + (formData.statusId || 0) + '&UserId=' + (this.webStorage.getUserId() || 0) + '&TextSearch=' + (formData.textSearch.trim() || '') + '&lan=' + this.lang, false, false, false, 'masterUrl');    
    //  '&ActionId=' + (formData.actionId || 0) + 
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.tableDataArray.map((ele:any)=>{
            ele.status1 = ele.status
          })
          this.totalPages = res.responseData1.totalPages;
          this.tableDatasize = res.responseData1.totalCount;
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'applicationNo', 'm_FullName', 'mobileNo1', 'm_Taluka', 'm_GrampanchayatName', 'applicationDate', 'm_Status', 'action'] : ['srNo', 'applicationNo', 'fullName', 'mobileNo1', 'taluka', 'grampanchayatName', 'applicationDate', 'status1', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'अर्ज आयडी', 'शेतकऱ्याचे नाव', 'मोबाईल क्र.', 'तालुका', 'ग्रामपंचायत', 'तारीख', 'स्थिती', 'कृती'] : ['Sr. No.', 'Application ID', 'Farmer Name', 'Mobile No.', 'Taluka', 'Grampanchayat', 'Date', 'Status', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      pagination: this.tableDatasize > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view: true,
      date: 'applicationDate'
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.searchDataFlag ? '' : (this.f['textSearch'].setValue(''));
        this.getTableData();
        break;
      case 'View':
        this.openApplicationDetails(obj);
        // this.router.navigate(['../approval-process']);
        break;
    }
  }

  openApplicationDetails(obj: any) {
    let Id: any = this.encryptdecrypt.encrypt(`${obj?.id}`);
    this.router.navigate(['../approval-process'], {
      queryParams: {
        id: Id
      },
     })
  }

  

  clearDropdown(dropdown: string) {
    if (dropdown == 'Taluka') {
      this.f['grampanchayatId'].setValue(0);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

