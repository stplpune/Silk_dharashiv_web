import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/services/master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnDestroy{
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
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
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
    public webStorage: WebStorageService
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
       this.setTableData();
    })
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_SchemeType', 'm_ActionName', 'description','status','action'] : ['srNo', 'schemeType', 'actionName', 'description', 'status', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'योजनेचे नाव', 'कृतीचे नाव','वर्णन','स्थिती','कृती'] : ['Sr. No.', 'Scheme Name', 'Action Name', 'Description', 'Status', 'ACTION'];
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
          this.schemeFilterArr.unshift({ id: 0, textEnglish: "All Scheme", textMarathi: "सर्व योजना" }, ...res.responseData);
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
      formvalue.id = Number(formvalue.id)
      let mainData = {...formvalue,"createdBy":this.webStorage.getUserId()};
      this.apiService.setHttp('POST', 'sericulture/api/Action/Insert-Update-Action', false, mainData, false, 'masterUrl');
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
      let userEng = obj.isBlock == false ?'Block' : 'Unblock';
      let userMara = obj.status == false ?'ब्लॉक' : 'अनब्लॉक';
      let dialoObj = {
        header: this.lang == 'mr-IN' ? 'कृती ' +userMara+ ' करा'  : userEng+' Action',
        title: this.lang == 'mr-IN' ? 'तुम्ही निवडलेली कृती '+userMara+' करू इच्छिता' : 'Do You Want To ' + userEng + ' The Selected Action?',
        cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
        okButton: this.lang == 'mr-IN' ? 'ओके' : 'Ok',
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.blockAction(obj) : this.getTableData();
    })
  }

  blockAction(obj: any) {
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
      title: this.lang == 'mr-IN' ? 'तुम्हाला क्रिया हटवायची आहे का ?' : 'Do You Want To Delete Action ?',
      header: this.lang == 'mr-IN' ? 'डिलीट करा' : 'Delete',
      okButton:  this.lang == 'mr-IN' ? 'डिलीट' : 'Delete',
      cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
