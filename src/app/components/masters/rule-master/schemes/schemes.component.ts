import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})
export class SchemesComponent {

  totalCount: number | any;
  tableDataArray = new Array();
  tableObj: object | any;
  highLightedFlag: boolean = true;
  pageNumber: number = 1;
  filterForm = new FormControl('');
  schemeForm!: FormGroup;
  stateArray = new Array();
  districtArray = new Array();
  imageResponse: string = '';
  data: any;
  @ViewChild('uplodLogo') clearlogo!: any;
  @ViewChild('formDirective') private formDirective!: NgForm;
  filtarFlag: boolean = false;
  subscription!: Subscription;
  lang: string = 'English';
  editorConfig = this.commonMethodService.editorConfig;

  constructor
    (
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private errorService: ErrorHandlingService,
      private commonMethodService: CommonMethodsService,
      private fb: FormBuilder,
      private master: MasterService,
      private fileUpl: FileUploadService,
      private WebStorageService: WebStorageService,
      public dialog: MatDialog,
      public validator: ValidationService,
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.getFormData();
    this.getState();
    this.getTableData();
  }

  // "schemeType": "Silk Samagra 2",
  //     "m_SchemeType": "सिल्क समग्र 2",
  //     "state": "Maharashtra",
  //     "m_State": "महाराष्ट्र",
  //     "districtId": 1,
  //     "district": "Osmanabad",
  //     "m_District": "उस्मानाबाद",

  getFormData(data?: any) {
    this.schemeForm = this.fb.group({
      schemeType: [data ? data.schemeType : '', [Validators.required, Validators.pattern(this.validator.alphaNumericWithSpace), this.validator.maxLengthValidator(100)]],
      stateId: [data ? data.stateId : 1],
      districtId: [data ? data.districtId : 1],
      logoPath: [''],
      isActive: [data ? data.isActive : true],
      schemeInfo: [data ? data.schemeInfo : '', [Validators.required, this.validator.maxLengthValidator(5000)]],
      m_SchemeType: [data ? data.m_SchemeType : '', [Validators.required, Validators.pattern(this.validator.marathi), this.validator.maxLengthValidator(100)]]
    })
    this.imageResponse = this.data ? this.data.logoPath : '';
  }

  get f() { return this.schemeForm.controls };

  getState() {
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
        this.data ? (this.schemeForm.controls['stateId'].setValue(this.data?.stateId), this.getDisrict()) : this.getDisrict();
      }), error: (() => {
        this.stateArray = [];
      })
    })
  }

  getDisrict() {
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.data ? this.schemeForm.controls['districtId'].setValue(this.data?.districtId) : '';
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.imageResponse = res.responseData;
        }
        else {
          this.clearlogo.nativeElement.value = "";
          this.imageResponse = "";
        }
      }),
      error: (error: any) => {
        this.clearlogo.nativeElement.value = "";
        this.spinner.hide();
        this.commonMethodService.checkDataType(error.status) == false ? this.errorService.handelError(error.statusCode) : this.commonMethodService.snackBar(error.statusText, 1);
      }
    })
  }

  viewimage() {
    window.open(this.imageResponse, '_blank')
  }

  deleteImage() {
    this.imageResponse = "";
    this.clearlogo.nativeElement.value = "";
  }

  onSubmitData() {
    let formData = this.schemeForm.value;
    this.spinner.show();
    if (this.schemeForm.invalid) {
      this.spinner.hide();
      return
    } else if (!this.imageResponse) {
      this.commonMethodService.snackBar("Please Uploade Logo", 1);
      this.spinner.hide();
      return;
    }
    else {
      formData.id = this.data ? this.data.id : 0;
      // formData.isActive=
      formData.logoPath = this.imageResponse;
      let mainData = { ...formData, "createdBy": this.WebStorageService.getUserId() };
      this.apiService.setHttp('post', 'sericulture/api/Scheme/Insert-Update-Scheme', false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
            this.commonMethodService.snackBar(res.statusMessage, 0)
            this.getTableData();
            // this.formDirective.resetForm();
            // this.clearlogo.nativeElement.value = "";
            // this.f['logoPath'].setValue('');
            // this.imageResponse="";
            // this.data=null;
            this.clearForm();
            this.filterForm.reset();
          } else {
            this.spinner.hide();
            this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.spinner.hide();
          this.errorService.handelError(error.status);
        }
      })
    }
  }


  getTableData(flag?: any) {
    let searchValue = this.filterForm.value || ''
    flag == 'filter' ? (this.pageNumber = 1, this.schemeForm.reset()) : '';
    this.apiService.setHttp('GET', 'sericulture/api/Scheme/get-All-Scheme?PageNo=' + this.pageNumber + '&PageSize=10&TextSearch=' + searchValue, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.show();
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.tableDataArray = res.responseData;
          this.totalCount = res.responseData1.totalPages;
        } else {
          this.spinner.hide();
          this.tableDataArray = [];
          this.totalCount = 0;
          // this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
        }
        this.setTableData();
      }),
      error: (err: any) => {
        this.spinner.hide();
        this.tableDataArray = [];
        this.totalCount = 0;
        this.errorService.handelError(err.status)
      }
    })
  }


  setTableData() {
    this.highLightedFlag = true;
    let displayedColumns = this.lang == 'en' ? ['srNo', 'schemeType', 'state', 'district', 'isActive', 'action'] : ['srNo', 'm_SchemeType', 'm_State', 'm_District', 'isActive', 'action']
    let tableHeaders = this.lang == 'en' ? ['Sr. No.', 'Scheme Name', 'State Name', 'District Name', 'Status', 'Action'] : ['अनुक्रमांक', 'योजनेचे नाव', 'राज्यांचे नाव', 'जिल्ह्याचे नाव', 'स्थिती', 'क्रिया']
    this.tableObj = {
      pageNumber: this.pageNumber,
      status: '',
      isBlock: 'isActive',
      tableData: this.tableDataArray,
      tableSize: this.totalCount,
      tableHeaders: tableHeaders,
      displayedColumns: displayedColumns,
      pagination: this.totalCount > 10 ? true : false,
      view: false,
      edit: true,
      delete: true,
      reset: false,
      // isBlock:'status'
    }
    this.highLightedFlag ? this.tableObj.highlightedrow = true : this.tableObj.highlightedrow = false;
    this.apiService.tableData.next(this.tableObj);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filtarFlag ? this.filterForm.reset() : ''
        this.getTableData();
        break;
      case 'Edit':
        this.data = obj;
        this.getFormData(obj);
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
      case 'Block':
        this.openBlockDialog(obj);
    }
  }

  openBlockDialog(obj?: any) {
    let userEng = obj.isActive == false ? 'Block' : 'Unblock';
    let userMara = obj.isActive == false ? 'ब्लॉक' : 'अनब्लॉक';
    let dialoObj = {
      header: this.lang == 'mr-IN' ? 'योजना ' + userMara + ' करा' : userEng + ' Action',
      title: this.lang == 'mr-IN' ? 'तुम्ही निवडलेली योजना ' + userMara + ' करू इच्छिता' : 'Do You Want To ' + userEng + ' The Selected Action?',
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
      result == 'Yes' ? this.blockScheme(obj) : this.getTableData();
    })
  }

  blockScheme(obj: any) {
    let status = !obj.isActive
    this.apiService.setHttp('PUT', 'sericulture/api/Scheme/ActiveInactiveScheme?Id=' + obj.id + '&IsActive=' + status, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        res.statusCode == "200" ? (this.commonMethodService.snackBar(res.statusMessage, 0), this.getTableData()) : this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
      },
      error: (error: any) => {
        this.errorService.handelError(error.status);
        this.commonMethodService.checkDataType(error.status) == false ? this.errorService.handelError(error.status) : this.commonMethodService.snackBar(error.status, 1);
      }
    })
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'en' ? 'Do You Want To Delete Selected Scheme ?' : 'तुम्हाला निवडलेली योजना हटवायची आहे का ?',
      header: this.lang == 'en' ?  'Delete Scheme' : 'योजना हटवा',
      okButton: this.lang == 'en' ?  'Delete' : 'हटवा',
      cancelButton:this.lang == 'en' ?  'Cancel' : 'रद्द करा',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('delete', 'sericulture/api/Scheme/DeleteScheme?Id=' + delObj.id, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethodService.snackBar(res.statusMessage, 0);
              this.data ? this.clearForm() : ''
              this.getTableData();
            } else {
              this.commonMethodService.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorService.handelError(error.statusCode);
          },
        });
      }
      this.highLightedFlag = false;
    });
  }

  clearForm() {
    this.formDirective.resetForm({
      stateId: 1,
      districtId: 1
    });
    this.clearlogo.nativeElement.value = "";
    this.imageResponse = "";
    this.data = null;
  }

  clearFilter() {
    this.filterForm.reset();
    this.getTableData();
  }

}
