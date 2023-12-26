import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-beneficiery',
  templateUrl: './beneficiery.component.html',
  styleUrls: ['./beneficiery.component.scss']
})
export class BeneficieryComponent {
  filterFrm!: FormGroup;
  districtArr = new Array();
  talukaArr = new Array();
  grampanchayatArray = new Array();
  departmentArray = new Array();
  schemeFilterArr = new Array();
  subscription!: Subscription;
  lang: string = 'English';
  get f() { return this.filterFrm.controls };
  talukaCtrl: FormControl = new FormControl();
  gramPCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();
  pageNumber: number = 1;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;

  constructor(
    private fb: FormBuilder,
    private master: MasterService,
    public webStorage: WebStorageService,
    public common: CommonMethodsService,
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
    this.defaultFillterForm();
    this.getDistrict();
    this.getAllScheme();
    this.getDepartment();
    this.searchDataZone();
    this.getTableData();
  }

  defaultFillterForm() {
    this.filterFrm = this.fb.group({
      districtId: [{ value: 1, disabled: true }],
      talukaId: [0],
      grampanchayatId: [0],
      schemeTypeId: [0],
      deptId: [0],
      textSearch: ['']
    })
  }

  getDistrict() {
    this.districtArr = [];
    this.master.GetAllDistrict(this.webStorage.getStateId() || 1).subscribe({
      next: ((res: any) => {
        this.districtArr = res.responseData;
        // this.spliteUrlData.length ? this.filterFrm.controls['districtId'].setValue(+this.filterFrm.getRawValue().districtId) : '';
        this.getTaluka();
      }), error: (() => {
        this.districtArr = [];
      })
    })
  }

  getTaluka() {
    this.talukaArr = [];
    let distId = this.filterFrm.getRawValue().districtId;
    this.master.GetAllTaluka(this.webStorage.checkUserIsLoggedIn() ? this.webStorage.getStateId() : 1, distId, 0,).subscribe({
      next: ((res: any) => {
        this.talukaArr = [{ id: 0, textEnglish: "All Taluka", textMarathi: "सर्व तालुका" }, ...res.responseData];
        this.common.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
        // this.spliteUrlData.length ? this.filterFrm.controls['talukaId'].setValue(+this.filterFrm.getRawValue().talukaId) : '';
        //  this.getGrampanchayat();
      }), error: (() => {
        this.talukaArr = [];
      })
    })
  }

  getGrampanchayat() {
    this.gramPSubject = new ReplaySubject<any>();
    this.grampanchayatArray = [];
    let talukaId = this.filterFrm.getRawValue().talukaId;
    if (talukaId != 0) {
      this.master.GetGrampanchayat(talukaId || 0).subscribe({
        next: ((res: any) => {
          this.grampanchayatArray = [{ id: 0, textEnglish: "All Grampanchayat", textMarathi: "सर्व ग्रामपंचायत" }, ...res.responseData];
          this.common.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
          //   this.spliteUrlData.length ? this.filterFrm.controls['grampanchayatId'].setValue(+this.filterFrm.getRawValue().grampanchayatId) : '';
        }), error: (() => {
          this.grampanchayatArray = [];
          this.gramPSubject.next(null);
        })
      })
    }
  }

  getAllScheme() {
    this.schemeFilterArr = [];
    this.master.GetAllSchemeType().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.schemeFilterArr = [{ id: 0, textEnglish: "All Scheme", textMarathi: "सर्व योजना" }, ...res.responseData];
          //this.spliteUrlData ? (this.filterFrm.controls['schemeTypeId'].setValue(+this.filterFrm.getRawValue().schemeTypeId), this.getAction()) : '';
          this.getDepartment();
        } else {
          this.schemeFilterArr = [];
        }
      },
    });
  }

  getDepartment() {
    this.departmentArray = [];
    // let schemeId = this.filterFrm.getRawValue().schemeTypeId;
    this.master.GetDepartmentDropdown(0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentArray = [{ "id": 0, "textEnglish": "All Department", "textMarathi": "सर्व विभाग" }, ...res.responseData];
        }
        else {
          this.departmentArray = [];
        }
      })
    })
  }

  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.common.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.common.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        //  this.searchDataFlag ? '' : (this.f['textSearch'].setValue(''));
        this.getTableData();
        break;
      case 'View':
        //   this.openApplicationDetails(obj);
        // this.router.navigate(['../approval-process']);
        break;
      case 'Edit':
        //    this.openAddApplicationDetails(obj);
        break;
      case 'track':
        //    this.openTracKComp(obj);
        // this.router.navigate(['../approval-process']);
        break;
    }
  }

  getTableData(_status?: any) {
    this.spinner.show();
    let formData = this.filterFrm.getRawValue();
    //  status == 'filter' ? ((this.pageNumber = 1), this.searchDataFlag = true) : '';
    let str = `pageno=${this.pageNumber || 1}&pagesize=10&SchemeTypeId=${formData.schemeTypeId}&DistrictId=${formData.districtId}&TalukaId=${formData.talukaId}&GrampanchayatId=${formData.grampanchayatId}&DepartmentId=${formData.deptId}&TextSearch=${formData.textSearch.trim()}&lan=${this.lang}&UserId=${this.webStorage?.getUserId()}`

    this.apiService.setHttp('GET', 'sericulture/api/Beneficiery/GetAllBeneficieryList?' + str, false, false, false, 'masterUrl');

    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
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
    let displayedColumns = ['srNo', 'mulberryId', (this.lang == 'en' ? 'schemeType' : 'm_SchemeType'), (this.lang == 'en' ? 'departmentName' : 'm_DepartmentName'), 'fullName', 'mobileNo1', (this.lang == 'en' ? 'taluka' : 'm_Taluka'), (this.lang == 'en' ? 'grampanchayatName' : 'm_GrampanchayatName'), 'mulberryDate','action']; //'action'
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', ' Mulberry ID', 'Scheme', 'Process Department', 'Farmer Name', 'Mobile No.', 'Taluka', 'Grampanchayat', 'Date','view'] : ['अनुक्रमांक', 'मुलबेरी आयडी', 'योजना', 'प्रक्रिया विभाग', 'शेतकऱ्याचे नाव', 'मोबाईल क्र.', 'तालुका', 'ग्रामपंचायत', 'दिनांक','पहा'];// 'पहा' 'view'

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
      date: 'mulberryDate'
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  clearSearchFilter() {  // for clear search field
    this.filterFrm.reset();
    this.defaultFillterForm();
    this.pageNumber = 1;
    this.getTableData();

  }
}
