import { Component } from '@angular/core';
import { AddRejectReasonComponent } from './add-reject-reason/add-reject-reason.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-reject-reason',
  templateUrl: './reject-reason.component.html',
  styleUrls: ['./reject-reason.component.scss']
})
export class RejectReasonComponent {
  filterFrm!: FormGroup;
  actionResp = new Array();
  tableresp= new Array();
  lang: any;
  totalItem:any;
  totalPages:any;
  pageNumber: number = 1;
  subscription!: Subscription;//used  for lang conv
  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private master: MasterService,
    private spinner:NgxSpinnerService,
    private apiService:ApiService,
    private error:ErrorHandlingService,
    public validation:ValidationService,
    private WebStorageService:WebStorageService,
    ) { }
 

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    console.log(this.subscription);
    
    this.defaultForm();
    this.getAction();
    this.bindTable();
  }

  defaultForm() {
    this.filterFrm = this.fb.group({
      actionId: [''],
      textSearch: [''],
    })
  }

  getAction() {
    this.master.GetActionDropDown().subscribe({
      next: ((res: any) => {
        this.actionResp = res.responseData;
      }), error: (() => {
        this.actionResp = [];
      })
    })
  }
  onSubmit() { }

  bindTable() {
    this.spinner.show();
    // flag == 'filter' ? (this.filterFlag = true, (this.pageNumber = 1)) :'';
    // let formData = this.filterFrm.getRawValue();
    // let str='pageno='+this.pageNumber+'&pagesize=10';
    this.apiService.setHttp('GET', 'sericulture/api/ Reject Reasons/GetAllRejectReasons?PageNo=1&PageSize=10', false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
    
        console.log(res);
        
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableresp = res.responseData;
          this.totalItem = res.responseData1.totalCount;
          this.totalPages = res.responseData1?.totalPages;
        } else {
          this.tableresp = [];
          this.totalItem = 0
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
        // this.filterFlag ? '' : (this.filterFrm.controls['scheme'].setValue(''),this.filterFrm.controls['department'].setValue(''), this.filterFlag = false);
        // this.pageNumber = obj.pageNumber;
        this.bindTable();
        break;
      case 'Edit':
        this.addrejectreason(obj);
        break;
      case 'View':
        // this.addactions(obj);
        break;
    }
  }

  setTableData() {
    // this.highLightedFlag = true;
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_ActionName', 'm_RejectionTitle', 'rejectionDescription', 'action'] : ['srNo', 'actionName', 'rejectionTitle', 'rejectionDescription', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'स्टेज/कृती', 'नकार शीर्षक', 'नकार वर्णन', 'कृती'] : ['Sr No', 'Stage/Action', 'Rejection Title', 'Rejection Description', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.totalItem > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableresp,
      tableSize: this.totalItem,
      tableHeaders: displayedheaders,
      delete: true, view: false, edit: true,
    };
    // this.highLightedFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }
  addrejectreason(data?:any) {
    this.dialog.open(AddRejectReasonComponent, {
      width: '40%',
      data:data
    })
  }

  clearFilterForm() {
    // this.formDirective?.resetForm();
    // this.defaultFrom();
    this.bindTable();
  }
}
