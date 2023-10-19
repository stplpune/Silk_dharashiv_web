import { Component, ViewChild } from '@angular/core';
import { SetRuleModalComponent } from './set-rule-modal/set-rule-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-set-rule',
  templateUrl: './set-rule.component.html',
  styleUrls: ['./set-rule.component.scss']
})
export class SetRuleComponent {

  tableresp = new Array();
  statresponse = new Array();
  districtresp = new Array();
  schemeTyperesp = new Array();
  departmentresp = new Array();
  highLightedFlag: boolean = true;
  filterFrm!: FormGroup;
  totalItem:any;
  pageNumber: number = 1;
  subscription!: Subscription;//used  for lang conv
  lang: any;
  @ViewChild('formDirective') private formDirective!: NgForm;
  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private error: ErrorHandlingService,
    private master: MasterService,
    private fb: FormBuilder,
    private WebStorageService: WebStorageService,
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })

    this.defaultFrom();
    this.bindTable();
    this.getState();
    this.getDisrict();
    this.getSchemeType();
    this.getDepartment();
  }

  defaultFrom() {
    this.filterFrm = this.fb.group({
      state: [1, [Validators.required]],
      district: [1, [Validators.required]],
      scheme: ['', [Validators.required]],
      department: ['', [Validators.required]],
    })
  }

  setrules(data?: any) {
    const dialogRef = this.dialog.open(SetRuleModalComponent, {
      width: '80%',
      data: data,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes' ? this.bindTable() : '';
      // this.highLightRowFlag = false;
      this.setTableData();
    });
  }


  bindTable() {
    this.spinner.show();
    // flag == 'filter' ? (this.searchDataFlag = true, this.clearMainForm(), (this.pageNumber = 1)) : this.searchDataFlag = false;
    let formData = this.filterFrm.getRawValue();
    // let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetAllApprovalMasterLevels?pageno='+this.pageNumber+'&pagesize=10&SchemeTypeId='+(formData.scheme || 0)+'&DepartmentId='+(formData.department || 0)+'&StateId='+ (formData.state || 1)+'&DistrictId='+(formData.district || 1)+'&lan=1', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        console.log(res);
        
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableresp = res.responseData;
          // this.totalItem = res.responseData.responseData2.pageCount;
        } else {
          this.tableresp = [];
        }
        this.setTableData();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.error.handelError(err.status);
      },
    });
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.bindTable();
        break;
      case 'Edit':
        this.setrules(obj);
        break;
      case 'View':
        this.addactions(obj);
        break;
    }
  }


  setTableData() {
    this.highLightedFlag = true;
    // this.lang == 'mr-IN' ? ['srNo', 'm_DepartmentName', 'm_DepartmentLevel', 'm_DesignationName', 'action'] : ['srNo', 'departmentName', 'departmentLevel', 'designationName', 'action']
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_State', 'm_District', 'm_SchemeType','m_DepartmentName', 'action']:['srNo', 'state', 'district', 'schemeType', 'departmentName', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ?['अनुक्रमांक', 'राज्यांचे नाव', 'जिल्ह्याचे नाव', 'योजनेचे नाव','विभाग', 'कृती']:['Sr No', 'State', 'District', 'Scheme', 'Department', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableresp,
      tableSize: '',
      tableHeaders: displayedheaders,
      delete: false, view: true, edit: true,
    };
    this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;
    this.apiService.tableData.next(tableData);
  }

  clearFilterForm() {
    this.formDirective?.resetForm();
    this.defaultFrom();
    this.bindTable();
  }

  addactions(obj?: any) {
    const dialogRef = this.dialog.open(SetRuleModalComponent, {
      width: '50%',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes' ? this.bindTable() : '';
      this.setTableData();
    });
  }

  // ---------------------------dropdown start here----------------------------

  getState() {
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.statresponse = res.responseData;
      }), error: (() => {
        this.statresponse = [];
      })
    })
  }

  getDisrict() {
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtresp = res.responseData;
      }), error: (() => {
        this.districtresp = [];
      })
    })
  }

  getSchemeType() {
    this.master.GetAllSchemeType().subscribe({
      next: ((res: any) => {
        this.schemeTyperesp = res.responseData;
      }), error: (() => {
        this.schemeTyperesp = [];
      })
    })
  }

  getDepartment() {
    this.master.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        this.departmentresp = res.responseData;
      }), error: (() => {
        this.departmentresp = [];
      })

    })
  }
  // ------------------------dropdown code end here----------------

}
