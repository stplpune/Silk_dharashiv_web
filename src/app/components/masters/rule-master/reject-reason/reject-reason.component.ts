import { Component, ViewChild } from '@angular/core';
import { AddRejectReasonComponent } from './add-reject-reason/add-reject-reason.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';

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
  filterFlag: boolean = false;
  subscription!: Subscription;//used  for lang conv
  @ViewChild('formDirective') private formDirective!: NgForm;
  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private master: MasterService,
    private spinner:NgxSpinnerService,
    private apiService:ApiService,
    private error:ErrorHandlingService,
    public validation:ValidationService,
    private WebStorageService:WebStorageService,
    private commonMethod:CommonMethodsService,
    ) { }
 

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    
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

  bindTable(flag?:any) {
    this.spinner.show();
    flag == 'filter' ? (this.filterFlag = true, (this.pageNumber = 1)) :'';
    let formData = this.filterFrm.getRawValue();
    let str='PageNo='+this.pageNumber+'&PageSize=10';
    this.apiService.setHttp('GET', 'sericulture/api/ Reject Reasons/GetAllRejectReasons?'+str+'&ActionId='+(formData.actionId || 0)+'&TextSearch='+(formData.textSearch.trim() || "")+'&lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableresp = res.responseData;
          this.totalItem = res.responseData1.totalCount;
          // this.totalPages = res.responseData1?.totalPages;
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
        this.filterFlag ? '' : (this.filterFrm.controls['actionId'].setValue(''),this.filterFrm.controls['textSearch'].setValue(''), this.filterFlag = false);
        this.pageNumber = obj.pageNumber;
        this.bindTable();
        break;
      case 'Edit':
        this.addrejectreason(obj);
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
    }
  }

  setTableData() {
    // this.highLightedFlag = true;
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_ActionName', 'm_RejectionTitle', 'rejectionDescription', 'action'] : ['srNo', 'actionName', 'rejectionTitle', 'rejectionDescription', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'स्टेज/कृती', 'नामंजूर  शीर्षक', 'नामंजूर  वर्णन', 'कृती'] : ['Sr No', 'Stage/Action', 'Rejection Title', 'Rejection Description', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination:  true ,
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
    const dialogRef = this.dialog.open(AddRejectReasonComponent, {
      width: '40%',
      data:data,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes' ? this.bindTable() : '';
      // this.highLightRowFlag = false;
      this.setTableData();
    });
  }

  clearFilterForm() {
    this.formDirective?.resetForm();
    this.defaultForm();
    this.bindTable();
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'mr-IN' ? 'तुम्ही निवडलेले नाकारलेले कारण हटवू इच्छिता?' : 'Do You Want To Delete Selected Rejected Reason ?',
      header: this.lang == 'mr-IN' ? 'डिलीट करा' : 'Delete',
      okButton: this.lang == 'mr-IN' ? 'डिलीट' : 'Delete',
      cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('delete', 'sericulture/api/ Reject Reasons/DeleteRejectReason?Id='+delObj.id+'&lan=' + this.lang, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.bindTable();
            } else {
              this.commonMethod.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.error.handelError(error.statusCode);
          },
        });
      }
      // this.highLightedFlag = false;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
