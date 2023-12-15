import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplaySubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { AddVillageComponent } from './add-village/add-village.component';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-village-circle',
  templateUrl: './village-circle.component.html',
  styleUrls: ['./village-circle.component.scss']
})
export class VillageCircleComponent implements OnDestroy {

  totalCount: number | any;
  tableDataArray = new Array();
  tableObj: object | any;
  highLightedFlag: boolean = true;
  pageNumber: number = 1;
  filterForm!: FormGroup;
  subscription!: Subscription;
  lang: string = 'English';
  filterFlag: boolean = false;
  pageAccessObject: object | any;
  talukaArray = new Array();
  grampanchayatArray = new Array();
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();
  constructor
    (
      public dialog: MatDialog,
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private errorService: ErrorHandlingService,
      private commonMethodService: CommonMethodsService,
      private WebStorageService: WebStorageService,
      private masterService: MasterService,
      private fb: FormBuilder,
      public validation: ValidationService
    ) { }

  ngOnInit() {
    this.WebStorageService.getAllPageName().filter((ele: any) => { return ele.pageName == 'Circle' ? this.pageAccessObject = ele : '' })
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    });
    this.getTaluka();
    this.getFilterFormData();
    this.searchDataZone();
    this.getTableData();
  }


  getFilterFormData() {
    this.filterForm = this.fb.group({
      textsearch: [''],
      talukaId: [0],
      grampanchayatId: [0]
    })
  }

  get f() { return this.filterForm.controls; }


  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethodService.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.commonMethodService.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }

  AddVillage(data?: any) {
    const dialogRef = this.dialog.open(AddVillageComponent, {
      width: '500px',
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.getTableData() : '';
    })
  }

  getTaluka() {
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        this.talukaArray.unshift({ id: 0, textEnglish: 'All Taluka', textMarathi: 'सर्व तालुका' }),
          this.commonMethodService.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
      }), error: (() => {
        this.talukaArray = [];
        this.talukaSubject.next(null);
      })
    })
  }


  getGrampanchayat() {
    let talukaId = this.filterForm.value.talukaId;
    if (talukaId != 0) {
      this.masterService.GetGrampanchayat(talukaId || 0).subscribe({
        next: ((res: any) => {
          this.grampanchayatArray = res.responseData;
          this.grampanchayatArray.unshift({ id: 0, textEnglish: 'All Grampanchayat', textMarathi: 'सर्व ग्रामपंचायत' });
          this.commonMethodService.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
        }), error: (() => {
          this.grampanchayatArray = [];
          this.gramPSubject.next(null);
        })
      })
    }
  }
  //sericulture/api/Circles/GetAllCircles?TalukaId=1&GrapanchyatId=1&pageno=1&pagesize=10&TextSearch=tt&lan=en
  getTableData(flag?: any) {
    let formValue = this.filterForm.value || ''
    this.spinner.show();
    flag == 'filter' ? this.pageNumber = 1 : ''
    this.apiService.setHttp('GET', 'sericulture/api/Circles/GetAllCircles?TalukaId=' + (formValue.talukaId || 0) + '&GrapanchyatId=' + (formValue.grampanchayatId || 0) + '&pageno=' + (this.pageNumber) + '&pagesize=10&TextSearch=' + formValue.textsearch || '', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.tableDataArray = res.responseData;
          this.totalCount = res.responseData1.totalCount;
          this.filterFlag = false;
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
    let tableHeaders = this.lang == 'en' ? ['Sr. No.', 'Taluka', 'Circle', 'Action'] : ['अनुक्रमांक', 'तालुका', 'मंडळाचे नाव', 'क्रिया'],
      displayedColumns = this.lang == 'en' ? ['srNo', 'taluka', 'circleName', 'action'] : ['srNo', 'm_Taluka', 'm_CircleName', 'action']
    this.tableObj = {
      pageNumber: this.pageNumber,
      isBlock: '',
      status: '',
      tableHeaders: tableHeaders,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.totalCount,
      pagination: this.totalCount > 10 ? true : false,
      // view: true,
      // edit: true,
      // delete: true,
      view: this.pageAccessObject?.readRight == true ? true : false,
      edit: this.pageAccessObject?.writeRight == true ? true : false,
      delete: this.pageAccessObject?.deleteRight == true ? true : false,
      reset: false
    }
    this.highLightedFlag ? this.tableObj.highlightedrow = true : this.tableObj.highlightedrow = false;
    this.apiService.tableData.next(this.tableObj);
  }


  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? (this.filterForm.reset(), this.getFilterFormData()) : '';
        this.getTableData();
        break;
      case 'Edit':
        this.AddVillage(obj);
        break;
      case 'View':
        this.AddVillage(obj);
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
    }
  }
  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'en' ? 'Do You Want To Delete Circle?' : 'तुम्हाला निवडलेले मंडळ हटवायचे आहे का?',
      header: this.lang == 'en' ? 'Delete Circle' : 'मंडळ हटवा',
      okButton: this.lang == 'en' ? 'Delete' : 'हटवा',
      cancelButton: this.lang == 'en' ? 'Cancel' : 'रद्द करा',
      headerImage: 'assets/images/delete.svg'
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('delete', 'sericulture/api/Circles/DeleteCircle?Id=' + delObj.id, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethodService.snackBar(res.statusMessage, 0);
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

  clearFilter() {
    this.filterForm.reset();
    this.pageNumber = 1;
    // this.getFilterFormData();
    this.gramPSubject = new ReplaySubject<any>();
    this.grampanchayatArray = [];
    this.f['grampanchayatId'].setValue('');
    this.f['textsearch'].setValue('');
    this.getTableData();
  }

  clearDropDown(flag?: any) {
    if (flag == 'gram') {
      this.gramPSubject = new ReplaySubject<any>();
      this.grampanchayatArray = [];
    }
    // this.getFilterFormData();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.talukaSubject?.unsubscribe();
    this.gramPSubject?.unsubscribe();
  }

}

