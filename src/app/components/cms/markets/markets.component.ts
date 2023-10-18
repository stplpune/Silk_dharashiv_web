import { Component } from '@angular/core';
import { AddMarketListComponent } from './add-market-list/add-market-list.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasterService } from 'src/app/core/services/master.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent {
  filterFrm !: FormGroup;
  pageNumber: number = 1;
  totalPages!: number;
  tableDataArray: any;
  tableDatasize!: number;
  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  highLightedFlag: boolean = true;
  subscription!: Subscription;//used  for lang conv
  lang: any;
  
  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
    private WebStorageService: WebStorageService) {}

  ngOnInit(){
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.formData();
    this.getState();
     this.getDistrict();
     this.getTaluka();
     this.bindTable();
  }

  formData(){
  this.filterFrm = this.fb.group({
    stateId:[1],
    districtId:[1],
    talukaId:[''],
    textSearch:['']
  })
  }

  bindTable(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? (this.pageNumber = 1) : '';
    let formData = this.filterFrm?.getRawValue();
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', `sericulture/api/MarketCommittee/get-All-marketCommittee?StateId=${formData?.stateId || 0}&DistrictId=${formData?.districtId || 0}&TalukaId=${formData?.talukaId || 0}&TextSearch=${formData?.textSearch || ''}` + str, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          this.tableDatasize = res.responseData1?.totalCount;
          this.totalPages = res.responseData1?.totalPages;
        } else {
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_DepartmentName', 'm_DepartmentLevel', 'm_DesignationName', 'action'] : ['srNo', 'marketName', 'district', 'taluka','mobileNo','action']
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमणिका', 'बाजारपेठेचे नाव', 'जिल्हा', 'तालुका','संपर्क क्रमांक', 'कृती'] : ['Sr. No.', 'Market Name', 'District', 'Taluka','Contact No.', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      delete: true, view: true, edit: true,
      };
    this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;
    this.apiService.tableData.next(tableData);
  }


  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        this.bindTable();
        break;
      case 'Edit':
        this.addMarket(obj);
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
      case 'View':
        this.addMarket(obj);
        break;
    }
  }

  addMarket(obj?: any) {
    let dialogRef = this.dialog.open(AddMarketListComponent, {
      width: '30%',
      data: obj,
      disableClose: true,
      autoFocus: true,
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.bindTable() : '';
      this.highLightedFlag = false;
     // this.setTableData();
    });
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'mr-IN' ? 'तुम्ही निवडलेले बाजार रेकॉर्ड हटवू इच्छिता?' : 'Do You Want To Delete Selected Market?',
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
        this.apiService.setHttp('delete', 'sericulture/api/MarketPrice/DeleteMarketRate?Id=' + delObj.id + '&lan=' + this.lang, false, false, false, 'masterUrl');
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
            this.errorHandler.handelError(error.statusCode);
          },
        });
      }
      this.highLightedFlag = false;
    });
  }

  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
          }
        else {
          this.stateArray = [];
           }
      })
    })
  }

  getDistrict() {
    this.districtArray = [];
   this.masterService.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.districtArray = res.responseData;
        }
        else {
          this.districtArray = [];
         }
      })
    })
  }

  getTaluka() {
    this.talukaArray = [];
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.talukaArray = res.responseData;
          }
        else {
          this.talukaArray = [];
          }
      })
    })
   }



  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  



}
