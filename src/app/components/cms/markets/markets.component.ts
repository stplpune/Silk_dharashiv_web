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
import { ValidationService } from 'src/app/core/services/validation.service';

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
  searchDataFlag: boolean = false

  constructor(public dialog: MatDialog,
    private fb: FormBuilder,
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
    public WebStorageService: WebStorageService,
    public validation: ValidationService,) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.formData();
    this.getState();
    this.bindTable();
  }

  formData() {
    this.filterFrm = this.fb.group({
      stateId: [this.WebStorageService.getStateId() == '' ? 0 : this.WebStorageService.getStateId()],
      districtId: [ this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],
      talukaId: [0],
      textSearch: ['']
    })
  }

  bindTable(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? (this.searchDataFlag = true, this.pageNumber = 1) : '';
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_District', 'm_Taluka', 'm_MarketName', 'conactNo', 'status', 'action'] : ['srNo', 'district', 'taluka', 'marketName', 'conactNo', 'status', 'action']
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमणिका', 'जिल्हा', 'तालुका', 'बाजारपेठेचे नाव', 'मोबाइल क्रमांक', 'स्थिती', 'कृती'] : ['Sr. No.', 'District', 'Taluka', 'Market Name', 'Mobile No.', 'Status', 'Action'];
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
        this.searchDataFlag ? (this.filterFrm.controls['talukaId'].setValue(this.filterFrm.value?.talukaId), this.filterFrm.controls['textSearch'].setValue(this.filterFrm.value?.textSearch)) : (this.filterFrm.controls['talukaId'].setValue(''), this.filterFrm.controls['textSearch'].setValue(''));
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
      width: '55%',
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
        this.apiService.setHttp('delete', 'sericulture/api/MarketCommittee/DeleteMarketCommittee?Id=' + delObj.id + '&lan=' + this.lang, false, false, false, 'masterUrl');
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

  //clear filter form functionality here
  clearForm() {
    this.formData();
    this.bindTable();
  }


  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
          (this.filterFrm.controls['stateId'].setValue(this.filterFrm.getRawValue()?.stateId), this.getDistrict());
        }
        else {
          this.stateArray = [];
        }
      })
    })
  }

  getDistrict() {
    this.districtArray = [];
    let stateId = this.filterFrm.getRawValue()?.stateId;
    if (stateId != 0) {
      this.masterService.GetAllDistrict(stateId).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.districtArray = res.responseData;
            this.districtArray.unshift({ "id": 0, "textEnglish": "All Districts","textMarathi": "सर्व जिल्हे"});
            (this.filterFrm.controls['districtId'].setValue(this.filterFrm.getRawValue()?.districtId), this.getTaluka());
          }
          else {
            this.districtArray = [];
          }
        })
      })
    }
  }

  getTaluka() {
    this.talukaArray = [];
    let stateId = this.filterFrm.getRawValue()?.stateId;
    let disId = this.filterFrm.getRawValue()?.districtId;
    if (disId != 0) {
      this.masterService.GetAllTaluka(stateId, disId, 0).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.talukaArray = res.responseData;
            this.talukaArray.unshift({ "id": 0, "textEnglish": "All Talukas","textMarathi": "सर्व तालुके"});
          }
          else {
            this.talukaArray = [];
          }
        })
      })
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }




}
