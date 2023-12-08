import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {
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
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();
  routingData:any;
  spliteUrlData!:any;

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
    private route:ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.route.queryParams.subscribe((queryParams: any) => {
      this.routingData = queryParams['id'];
    });
    this.spliteUrlData = this.routingData ?  this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.'):[];
    this.filterDefaultFrm(); 
    if(this.spliteUrlData.length){
      this.filterFrm.patchValue({ //'dis','tal','gram','scheme','action','app final Status'
        districtId:this.spliteUrlData[0],
        talukaId:this.spliteUrlData[1],
        grampanchayatId:this.spliteUrlData[2],
        schemeTypeId:this.spliteUrlData[3],
        actionId:this.spliteUrlData[4],
        statusId:this.spliteUrlData[5],
      });
    }


    this.spliteUrlData.length ? '': this.getTableData(); 
    this.getAllScheme();
    this.getDisrict(); 
    this.getStatus(); 
    this.getAction(); 
    this.searchDataZone();
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      schemeTypeId: [0],
      districtId: [this.webStorage.getDistrictId() == '' ? 0 : this.webStorage.getDistrictId()],
      talukaId: [ this.webStorage.getTalukaId() == '' ? 0 : this.webStorage.getTalukaId()],
      grampanchayatId: [ this.webStorage.getGrampanchayatId() == '' ? 0 : this.webStorage.getGrampanchayatId()],
      statusId: [0],
      actionId: [0],
      textSearch: [''],
    })
  }

  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.common.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.common.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }

  getAllScheme() {
    this.schemeFilterArr = [];
    this.master.GetAllSchemeType().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.schemeFilterArr.unshift({ id: 0, textEnglish: "All Scheme", textMarathi: "सर्व योजना" }, ...res.responseData);
          this.spliteUrlData ?  this.filterFrm.controls['schemeTypeId'].setValue(+this.filterFrm.getRawValue().schemeTypeId):'';
    
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
        this.spliteUrlData.length ?  this.filterFrm.controls['districtId'].setValue(+this.filterFrm.getRawValue().districtId):'';
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
        this.common.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
        this.spliteUrlData.length ?  this.filterFrm.controls['talukaId'].setValue(+this.filterFrm.getRawValue().talukaId):'';
        this.getGrampanchayat();
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
          this.grampanchayatArray.unshift({ id: 0, textEnglish: "All Grampanchayat", textMarathi: "सर्व ग्रामपंचायत" }, ...res.responseData);
          this.common.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
          this.spliteUrlData.length ?  this.filterFrm.controls['grampanchayatId'].setValue(+this.filterFrm.getRawValue().grampanchayatId):'';
        }), error: (() => {
          this.grampanchayatArray = [];
          this.gramPSubject.next(null);
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
          this.spliteUrlData.length ?  this.filterFrm.controls['statusId'].setValue(+this.filterFrm.getRawValue().statusId):'';
          
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
          this.spliteUrlData.length ?  (this.filterFrm.controls['actionId'].setValue(+this.filterFrm.getRawValue().actionId), this.getTableData()):'';
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
     '&ActionId=' + (formData.actionId || 0) + 
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.tableDataArray.map((ele:any)=>{
            ele.status1 = (this.lang == 'en' ? ele.status : ele.m_Status)
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
    let displayedColumns = ['srNo', 'applicationNo', (this.lang == 'en' ? 'departmentName' : 'm_DepartmentName'), (this.lang == 'en' ?'schemeType':'m_SchemeType'), (this.lang == 'en' ?'fullName': 'm_FullName'), 'mobileNo1', (this.lang == 'en' ?'taluka':'m_Taluka'), (this.lang == 'en' ?'grampanchayatName':'m_GrampanchayatName'), 'selfStatus','status1', 'action'] ;
    let displayedheaders = this.lang == 'en' ? ['Sr.No.', 'Application ID','Process Department','Scheme Name', 'Farmer Name', 'Mobile No.', 'Taluka', 'Grampanchayat','Stage','Application Status', 'Action'] : ['अनुक्रमांक', 'अर्ज आयडी','प्रक्रिया विभाग','योजनेचे नाव', 'शेतकऱ्याचे नाव', 'मोबाईल क्र.', 'तालुका', 'ग्रामपंचायत','Stage','Application Status', 'कृती'] ;
    //this.webStorage.getDesignationId() == 1 ? 
    if (this.webStorage.getDesignationId() === 1) {
      const selfStatusIndex = displayedColumns.indexOf('selfStatus');
      const headerselfStatusIndex = displayedheaders.indexOf('Stage');
      if (selfStatusIndex !== -1 && headerselfStatusIndex !== -1) {
          displayedColumns.splice(selfStatusIndex, 1); // Remove selfStatus column
          displayedheaders.splice(headerselfStatusIndex,1)
         }
     }
     
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
    let Id: any = this.encryptdecrypt.encrypt(`${obj?.id}`+'.'+`${obj?.actionId || 0}`+'.'+`${obj.schemeTypeId==1 ? 'm':'s'}`);
    this.router.navigate([obj.schemeTypeId==1 ? '../approval-process-manarega':'../approval-process-silk-samgra'], {
      queryParams: {
        id: Id
      },
     })
  }

  

  clearDropdown(dropdown: string) {
    if (dropdown == 'Taluka') {
      this.f['grampanchayatId'].setValue(0);
      this.grampanchayatArray = [];
      this.gramPSubject = new ReplaySubject<any>();
    }
  }

  clearSearchFilter() {  // for clear search field
    this.filterFrm.reset();
    this.filterDefaultFrm();
    this.getTableData();
    this.pageNumber = 1;
    this.searchDataFlag = false;
    this.spliteUrlData.length ? this.spliteUrlData = []:'';
    //this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.common.filterArrayDataZone([], this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
    //this.gramPSubject = new ReplaySubject<any>();
    //this.grampanchayatArray = [];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.gramPSubject.unsubscribe();
    this.talukaSubject.unsubscribe();
  }

}
