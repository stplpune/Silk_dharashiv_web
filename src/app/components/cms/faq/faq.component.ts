import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnDestroy {
  faqFrm!: FormGroup;
  filterFrm!: FormGroup;
  editFlag: boolean = false;
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  pageNumber: number = 1;
  highLightRowFlag: boolean = false;
  searchDataFlag: boolean = false
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  @ViewChild('formDirective') private formDirective!: NgForm;
  get f() { return this.faqFrm.controls };
  get fl() { return this.filterFrm.controls };

  constructor(private fb: FormBuilder,
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
    this.getTableData();
  }

  defaultFrm(data?: any) {
    this.faqFrm = this.fb.group({
      id: [data ? data.id : 0],
      question: [data ? data.question : '', [Validators.required, Validators.maxLength(200)]],
      m_Question: [data ? data.m_Question : '', [Validators.required, Validators.maxLength(200)]],
      answer: [data ? data.answer : '', [Validators.required, Validators.maxLength(1000)]],
      m_Answer: [data ? data.m_Answer : '', [Validators.required, Validators.maxLength(1000)]],
      flag: [this.editFlag ? "u" : "i"]
    })
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      textSearch: [''],
    })
  }

  getTableData(status?: any) {
    this.spinner.show();
    status == 'filter' ? ((this.pageNumber = 1), this.defaultFrm(), this.searchDataFlag = true) : '';
    let str = `&pageNo=${this.pageNumber}&pageSize=10`;
    let searchValue = this.filterFrm?.value || '';
    this.apiService.setHttp('GET', 'sericulture/api/FAQ/get-faq-details?SeacrhText='+ (searchValue.textSearch || '') + str, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;
          this.totalPages = res.responseData.responseData1?.totalPages;
          this.tableDatasize = res.responseData.responseData1?.totalCount;
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_Question', 'status', 'action'] : ['srNo', 'question', 'status', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'प्रश्न', 'स्थिती', 'कृती'] : ['Sr. No.', 'Question', 'Status', 'ACTION'];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      isBlock: 'status',
      pagination: this.tableDatasize > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
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

  onSubmitData() {
    let formvalue = this.faqFrm.value;
    if (this.faqFrm.invalid) {
      return
    } else {
      this.spinner.show();
      formvalue.id = Number(formvalue.id)
      let mainData = { ...formvalue, "createdBy": this.webStorage.getUserId() };
      this.apiService.setHttp('POST', 'sericulture/api/FAQ/save-update-faq', false, mainData, false, 'masterUrl');
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

  openBlockDialog(obj?: any) {
    let userEng = obj.status == false ?'Publish' : 'UnPublish';
    let userMara = obj.status == false ?'प्रकाशित' : 'अप्रकाशित';
    let dialoObj = {
      header: this.lang == 'mr-IN' ? 'एफएक्यू ' +userMara+ ' करा'  : userEng+' FAQ',
      title: this.lang == 'mr-IN' ? 'तुम्ही निवडलेली एफएक्यू '+userMara+' करू इच्छिता' : 'Do You Want To ' + userEng + ' The Selected FAQ?',
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
  this.apiService.setHttp('PUT', 'sericulture/api/FAQ/FAQ-Action-Status?Id=' + obj.id + '&Status=' + status, false, false, false, 'masterUrl');
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
      title: this.lang == 'mr-IN' ? 'तुम्हाला एफएक्यू हटवायचा आहे का ?' : 'Do You Want To Delete FAQ ?',
      header: this.lang == 'mr-IN' ? 'डिलीट करा' : 'Delete',
      okButton: this.lang == 'mr-IN' ? 'डिलीट' : 'Delete',
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
        this.apiService.setHttp('DELETE', 'sericulture/api/FAQ/delete-faq?Id=' + (delDataObj.id || 0), false, delDataObj, false, 'masterUrl');
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

  onEditData(receiveObj: any) {
    this.editFlag = true;
    this.defaultFrm(receiveObj);
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
