import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/services/master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
  actionFrm!: FormGroup;
  filterFrm!: FormGroup;
  schemeArray = new Array();
  schemeFilterArr = new Array();
  editFlag: boolean = false;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  pageNumber: number = 1;
  highLightRowFlag: boolean = false;
  searchDataFlag: boolean = false;
  @ViewChild('formDirective') private formDirective!: NgForm;
  get f() { return this.actionFrm.controls };
  get fl() { return this.filterFrm.controls };

  constructor(private fb: FormBuilder,
    private master: MasterService,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.defaultFrm();
    this.filterDefaultFrm();
    this.getAllScheme();
    this.getTableData();
  }

  defaultFrm(data?: any) {
    this.actionFrm = this.fb.group({
      id: [data ? data.id : 0],
      actionName: [data ? data.actionName : '', [Validators.required, Validators.pattern(this.validator.fullName), Validators.maxLength(50)]],
      m_ActionName: [data ? data.m_ActionName : '', [Validators.required, Validators.pattern(this.validator.marathi), Validators.maxLength(50)]],
      schemeTypeId: [data ? data.schemeTypeId : '', Validators.required],
      description: [data ? data.description : '', Validators.maxLength(500)],
      createdBy: [0],
      flag: [this.editFlag ? "u" : "i"]
    })
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      schemeTypeId: [0],
      textSearch: ['']
    })
  }

  getTableData(status?: any) {
    this.spinner.show();
    let formData = this.filterFrm.getRawValue();
    status == 'filter' ? ((this.pageNumber = 1), this.defaultFrm(), this.searchDataFlag = true) : '';
    let str = `&pageNo=${this.pageNumber}&pageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/Action/get-All-Action?SchemeTypeId=' + (formData?.schemeTypeId || 0) + str + '&TextSearch=' + (formData.textSearch.trim() || ''), false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.totalPages = res.responseData1?.totalPages;
          this.tableDatasize = res.responseData1?.totalCount;
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
    let displayedColumns = ['srNo', 'schemeType', 'actionName', 'description', 'status', 'action'];
    let displayedheaders = ['Sr. No.', 'Scheme Name', 'Action Name', 'Description', 'Status', 'ACTION'];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      img: '',
      blink: '',
      badge: '',
      isBlock: 'status',
      pagination: this.totalPages > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.totalPages,
      tableHeaders: displayedheaders,
      edit: true,
      delete: true,
    };
    this.highLightRowFlag ? (tableData.highlightedrow = true) : (tableData.highlightedrow = false);
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj?: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.editFlag = false;
        this.clearFormData();
        this.searchDataFlag ? (this.fl['textSearch'].setValue(this.filterFrm.value.textSearch)) : (this.fl['textSearch'].setValue(''));
        this.getTableData();
        break;
      case 'Edit':
        this.editFlag = true
        this.onEditData(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
      case 'Block':
        this.openBlockDialog(obj);
    }
  }

  getAllScheme() {
    this.schemeArray = [];
    this.master.GetAllSchemeType().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.schemeArray = res.responseData;
          this.schemeFilterArr.unshift({ value: 0, textEnglish: "All Scheme" }, ...res.responseData);
        } else {
          this.schemeFilterArr = [];
          this.schemeArray = [];
        }
      },
    });
  }

  onSubmitData() {
    let formvalue = this.actionFrm.value;
    if (this.actionFrm.invalid) {
      return
    } else {
      this.spinner.show();
      this.apiService.setHttp('POST', 'sericulture/api/Action/Insert-Update-Action', false, formvalue, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.common.snackBar(res.statusMessage, 0);
            this.clearFormData();
            this.defaultFrm();
            this.filterFrm.controls['textSearch'].setValue('');
            this.getTableData();
            this.editFlag = false;
          } else {
            this.spinner.hide();
            this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
          }
        }),
        error: ((error: any) => {
          this.spinner.hide()
          this.errorService.handelError(error.status)
        })
      })
    }
  }

  onEditData(receiveObj: any) {
    this.editFlag = true;
    this.defaultFrm(receiveObj);
  }

  openBlockDialog(obj?: any) {
    let userEng = obj.status == false ? 'Block' : 'Unblock';
    let dialoObj = {
      header: userEng + ' Action',
      title: 'Do You Want To ' + userEng + ' The Selected Action?',
      cancelButton: 'Cancel',
      okButton: 'Ok'
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.blockOffice(obj) : this.getTableData();
    })
  }

  blockOffice(obj: any) {
    let status = !obj.status
    this.apiService.setHttp('PUT', 'sericulture/api/Action/ActionStatus?Id=' + obj.id + '&Status=' + status, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? (this.common.snackBar(res.statusMessage, 0), this.getTableData()) : this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.common.snackBar(res.statusMessage, 1);
      },
      error: (error: any) => {
        this.errorService.handelError(error.status);
        this.common.checkDataType(error.status) == false ? this.errorService.handelError(error.status) : this.common.snackBar(error.status, 1);
      }
    })
  }

  globalDialogOpen(delDataObj?: any) {
    let dialogObj = {
      title: 'Do You Want To Delete Action?',
      header: 'Delete',
      okButton: 'Delete',
      cancelButton: 'Cancel',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialogObj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.apiService.setHttp('DELETE', 'sericulture/api/Action/DeleteAction?Id=' + (delDataObj.id || 0), false, delDataObj, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.common.snackBar(res.statusMessage, 0);
              this.getTableData();
              this.clearFormData();
              this.editFlag = false;
            } else {
              this.common.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorService.handelError(error.status);
          },
        });
      }
      this.highLightRowFlag = false;
    });
  }

  clearSearchFilter() {  // for clear search field
    this.filterFrm.reset();
    this.filterDefaultFrm();
    this.getTableData();
    this.pageNumber = 1;
    this.searchDataFlag = false;
  }

  clearFormData() { // for clear Form field
    this.editFlag = false;
    this.formDirective?.resetForm();
    this.defaultFrm();
  }
}
