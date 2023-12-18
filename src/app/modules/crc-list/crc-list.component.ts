import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subscription } from 'rxjs';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';

@Component({
  selector: 'app-crc-list',
  templateUrl: './crc-list.component.html',
  styleUrls: ['./crc-list.component.scss']
})
export class CRCListComponent {
  crcForm!: FormGroup;
  districtArray = new Array();
  talukaArray = new Array();
  statusArray = new Array();
  subscription!: Subscription;
  lang: string = 'English';
  pageNumber: number = 1;
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  tableDataArray: any;
  tableDatasize!: number;
  totalPages!: number;
  highLightedFlag: boolean = true;
  filterFlag: boolean = false;
  countObject: any;
  constructor
    (
      private fb: FormBuilder,
      private masterService: MasterService,
      private commonMethod: CommonMethodsService,
      public WebStorageService: WebStorageService,
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private errorHandler: ErrorHandlingService,
      public validation: ValidationService,
      public dialog: MatDialog,
      private router: Router,
      public encryptdecrypt: AesencryptDecryptService,

  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.getFormData();
    this.searchDataZone();
    this.getDisrict();
    this.getStatus();
    this.getTableData();
  }

  getFormData() {
    this.crcForm = this.fb.group({
      districtId: [this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],
      talukaId: [this.WebStorageService.getTalukaId() ? this.WebStorageService.getTalukaId() : 0],
      statusId: [0],
      searchValue: [''],
    })
  }

  get f() { return this.crcForm.controls }

  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
  }

  getDisrict() {
    this.districtArray = [];
    this.masterService.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.getTaluka();
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }

  getTaluka() {
    this.talukaArray = [];
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        this.talukaArray.unshift({ id: 0, textEnglish: 'All Taluka', textMarathi: 'सर्व तालुका' }),
          this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
      }), error: (() => {
        this.talukaArray = [];
        this.talukaSubject.next(null);
      })
    })
  }

  getStatus() {
    this.masterService.getCRCStatus().subscribe({
      next: ((res: any) => {
        this.statusArray = res.responseData;
      }), error: (() => {
        this.statusArray = [];
      })
    })
  }

  getTableData(flag?: any) {
    this.spinner.show();
    let formData = this.crcForm.getRawValue();
    flag == 'filter' ? this.pageNumber = 1 : ''
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/CRCCenter/Get-CRC-Center-List_web?DistrictId=' + (formData.districtId || 0) + '&TalukaId=' + (formData.talukaId || 0) + '&Status=' + (formData.statusId || 0) + '&SearchText=' + (formData.searchValue || '') + str, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData1;
          this.countObject = res.responseData;
          this.tableDatasize = res.responseData2.totalCount;
          this.totalPages = res.responseData2.totalPages;
        } else {
          this.spinner.hide();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : '';
          this.tableDataArray = []; this.tableDatasize = 0;
        }
        this.setTableData();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status);
      },
    });
  }

  setTableData() {
    this.highLightedFlag = true;
    let displayedColumns = this.lang == 'en' ? ['srNo', 'crcRegNo', 'crcName', 'ownerName', 'mobNo1', 'village', 'taluka', 'expireOn', 'isActive','status', 'action']
      : ['srNo', 'crcRegNo', 'm_CRCName', 'm_OwnerName', 'mobNo1', 'm_Village', 'm_Taluka', 'expireOn', 'isActive','status', 'action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Reg No', 'CRC Name', 'Owner Name', 'Mobile No', 'Village', 'Taluka', 'Expire On', 'Block/Unblock','Status','Action'] :
      ['अनुक्रमांक', 'नोंदणी क्रमांक', 'CRC नाव', 'मालकाचे नाव', 'मोबाईल नंबर', 'गाव', 'तालुका', 'कालबाह्य','ब्लॉक/अनब्लॉक', 'स्थिती', 'कृती'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      isBlock: 'isActive',
      date: 'expireOn',
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view: true,
      edit: false,
      delete: false,
      selfStatus:'status'
    };
    this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;
    this.apiService.tableData.next(tableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? this.getFormData() : ''
        this.getTableData();
        break;
      case 'View':
        this.viewCRCList(obj);
        break;
      case 'Block':
        this.openBlockDialog(obj);
        break;
    }
  }

 viewCRCList(obj: any) {
  let Id: any = this.encryptdecrypt.encrypt(`${obj?.id}`);
  this.router.navigate(['crc-center-details'], {
    queryParams: {
      id: Id
    },
  })
  }

  openBlockDialog(obj?: any) {
    let userEng = obj.isActive == false ? 'Block' : 'Unblock';
    let userMara = obj.isActive == false ? 'सक्रिय' : 'निष्क्रिय';
    let dialoObj = {
      header: this.lang == 'mr-IN' ? 'CRC केंद्र स्थिती ' + userMara + ' करा' : userEng + ' CRC Center',
      title: this.lang == 'mr-IN' ? 'तुम्ही निवडलेली CRC केंद्र ' + userMara + ' करू इच्छिता ?' : 'Do You Want To ' + userEng + ' The Selected CRC Centers?',
      cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
      okButton: this.lang == 'mr-IN' ? 'ओके' : 'Ok',
      headerImage: obj.isActive == false ? 'assets/images/active_scheme@3x.png' : 'assets/images/inactive_scheme.png'
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false,
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      let statusObj = {
        "id": obj?.id,
        "isActive": !obj.isActive,
        "reason": ""
      }      
      result == 'Yes' ? this.blockScheme(statusObj) : '';
    })
  }

  blockScheme(obj: any) {
    this.apiService.setHttp('put', 'sericulture/api/UserRegistration/User-Active-Status?lan=' + this.lang, false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.getTableData();
        }
        else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode)  : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(error.status);
      }
    })
  }

  clearFormData() {
    this.crcForm.reset();
    this.pageNumber = 1;
    this.getFormData();
    this.getTableData();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
