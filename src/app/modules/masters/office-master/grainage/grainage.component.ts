import { Component } from '@angular/core';
import { AddGrainageComponent } from './add-grainage/add-grainage.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-grainage',
  templateUrl: './grainage.component.html',
  styleUrls: ['./grainage.component.scss']
})
export class GrainageComponent {
  filterFrm!: FormGroup;
  grainageArr = new Array();
  stateArr = new Array();
  tableDataArray = new Array();
  tableDatasize!: number;
  totalPages!: number;
  pageNumber: number = 1;
  highLightRowFlag: boolean = false;
  searchDataFlag: boolean = false
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  get fl() { return this.filterFrm.controls };

  constructor(private fb: FormBuilder,
    private master: MasterService,
    private spinner: NgxSpinnerService,
    public validator: ValidationService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    private common: CommonMethodsService,
    public dialog: MatDialog,
    public webStorage: WebStorageService) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.filterDefaultFrm();
    this.getTableData();
    this.getGrainage();
    this.getState();
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      type: [0],
      stateId: [0],
      textSearch: [''],
    })
  }

  getGrainage() {
    this.grainageArr = [];
    this.apiService.setHttp('GET', 'sericulture/api/DropdownService/get-Grainage-Type?lan=' + this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.grainageArr.unshift({ id: 0, textEnglish: "All Type", textMarathi: "सर्व प्रकार" }, ...res.responseData);
        } else {
          this.grainageArr = [];
        }
      }
    });
  }

  getState() {
    this.stateArr = [];
    this.master.GetAllState().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.stateArr.unshift({ id: 0, textEnglish: "All State", textMarathi: "सर्व राज्य" }, ...res.responseData);
        } else {
          this.stateArr = [];
        }
      },
    });
  }

  getTableData(status?: any) {
    this.spinner.show();
    let formData = this.filterFrm.getRawValue();
    status == 'filter' ? ((this.pageNumber = 1), this.searchDataFlag = true) : '';
    let str = `&pageNo=${this.pageNumber}&pageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/GrainageModel/Get-Grainage-Details?Type=' + (formData?.type || 0) + '&StateId=' + (formData?.stateId || 0) + '&SearchText=' + (formData.textSearch.trim() || '') + str + '&lan=' + this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;
          this.totalPages = res.responseData.responseData2?.totalPages;
          this.tableDatasize = res.responseData.responseData2?.totalCount;
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_Type', 'm_Grainage', 'm_State', 'm_District', 'action'] : ['srNo', 'type', 'grainage', 'state', 'district', 'action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'प्रकार', 'ग्रेनेज', 'राज्य', 'जिल्हा', 'कृती'] : ['Sr. No.', 'Type', 'Grainage', 'State', 'District', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      highlightedrow: true,
      pagination: this.tableDatasize > 10 ? true : false,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view: true,
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
        this.searchDataFlag ? '' : (this.fl['textSearch'].setValue(''));
        this.getTableData();
        break;
      case 'Edit':
        this.addgrainage(obj);
        break;
      case 'View':
        this.addgrainage(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
    }
  }

  globalDialogOpen(delDataObj?: any) {
    let dialogObj = {
      title: this.lang == 'mr-IN' ? 'तुम्हाला ग्रेनेज हटवायचा आहे का ?' : 'Do You Want To Delete Grainage ?',
      header: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      okButton: this.lang == 'mr-IN' ? 'हटवा' : 'Delete',
      cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
      headerImage: 'assets/images/delete.svg'
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialogObj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.apiService.setHttp('DELETE', 'sericulture/api/GrainageModel/Delete-Grainage?grainageId=' + (delDataObj.id || 0) + '&lan=' + this.lang, false, delDataObj, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.common.snackBar(res.statusMessage, 0);
              this.getTableData();
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

  addgrainage(obj?: any) {
    const dialogRef = this.dialog.open(AddGrainageComponent, {
      width: '550px',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes' ? this.getTableData() : '';
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
