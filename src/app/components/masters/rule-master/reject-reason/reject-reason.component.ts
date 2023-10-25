import { Component } from '@angular/core';
import { AddRejectReasonComponent } from './add-reject-reason/add-reject-reason.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';

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
  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private master: MasterService,
    private spinner:NgxSpinnerService,
    private apiService:ApiService,
    private error:ErrorHandlingService,
    ) { }
 

  ngOnInit() {
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
        console.log(res);
        
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
    
        
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableresp = res.responseData;
          // this.totalItem = res.responseData1.totalCount;
          // this.totalPages = res.responseData1?.totalPages;
        } else {
          this.tableresp = [];
          // this.totalItem = 0
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
        // this.setrules(obj);
        break;
      case 'View':
        // this.addactions(obj);
        break;
    }
  }

  setTableData() {
    // this.highLightedFlag = true;
    // this.lang == 'mr-IN' ? ['srNo', 'm_DepartmentName', 'm_DepartmentLevel', 'm_DesignationName', 'action'] : ['srNo', 'departmentName', 'departmentLevel', 'designationName', 'action']
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_ActionName', 'm_RejectionTitle', 'm_RejectionTitle', 'action'] : ['srNo', 'actionName', 'rejectionTitle', 'rejectionDescription', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'राज्यांचे नाव', 'जिल्ह्याचे नाव', 'योजनेचे नाव', 'कृती'] : ['Sr No', 'Stage/Action', 'Rejection Title', 'Rejection Description', 'Action'];
    let tableData = {
      // pageNumber: this.pageNumber,
      // pagination: this.totalItem > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableresp,
      // tableSize: this.totalItem,
      tableHeaders: displayedheaders,
      delete: true, view: false, edit: true,
    };
    // this.highLightedFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }
  addrejectreason() {
    this.dialog.open(AddRejectReasonComponent, {
      width: '40%'
    })
  }
}
