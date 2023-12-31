import { Component, OnDestroy} from '@angular/core';
import { AddcircleComponent } from './addcircle/addcircle.component';
import { MatDialog} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { FormControl } from '@angular/forms';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-block-circle',
  templateUrl: './block-circle.component.html',
  styleUrls: ['./block-circle.component.scss']
})
export class BlockCircleComponent implements OnDestroy{
  pageNumber: number = 1;
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  tableDataArray = new Array();
  textsearch = new FormControl('');
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  pageAccessObject: object|any;
  filterFlag : boolean = false;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    private errorHandler: ErrorHandlingService,
    public dialog: MatDialog,
    private WebStorageService:WebStorageService,
    public validator : ValidationService
  ) { }

  ngOnInit() {  
    this.WebStorageService.getAllPageName().filter((ele:any) =>{return ele.pageName == 'Department'? this.pageAccessObject = ele :''})
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
       this.setTableData();
    })
    this.getTableData();
  }

  getTableData(flag?: any) {    
    this.spinner.show();
    flag == 'filter' ? (this.pageNumber = 1) : '';
    this.apiService.setHttp('GET', `sericulture/api/TalukaBlocks/GetAllTalukaBlocks?pageno=${this.pageNumber}&pagesize=10&TextSearch=${this.textsearch.value || ''}&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;          
          this.tableDatasize = res.responseData1?.totalCount;
          this.totalPages = res.responseData1?.totalPages;
        } else {
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
    this.highLightRowFlag = true;
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_BlockName','action'] : ['srNo', 'blockName','action']
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'ब्लॉकचे नाव','कृती'] : ['Sr. No.', 'Block Name','Action'];

    let getTableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      view: this.pageAccessObject?.readRight == true ? true: false,
      edit: this.pageAccessObject?.writeRight == true ? true: false,
      delete: this.pageAccessObject?.deleteRight == true ? true: false
      // delete: true, view: true, edit: true,
    };
    this.highLightRowFlag ? (getTableData.highlightedrow = true) : (getTableData.highlightedrow = false);
    this.apiService.tableData.next(getTableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? this.textsearch.reset() : '';
        this.getTableData();
        break;
      case 'Edit':
        this.addcircle(obj);
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
      case 'View':
        this.addcircle(obj);
        break; 
    }
  }

  globalDialogOpen(delDataObj?: any) {
    let dialogObj = {
      title: this.lang == 'mr-IN' ? 'तुम्हाला ब्लॉक हटवायचा आहे का?' : 'Do You Want To Delete Block?',
      header: this.lang == 'mr-IN' ? 'डिलीट करा' : 'Delete',
      okButton:  this.lang == 'mr-IN' ? 'डिलीट' : 'Delete',
      cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
      headerImage:'assets/images/delete.svg'
    };

    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialogObj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'Yes') {
        this.apiService.setHttp('DELETE', 'sericulture/api/TalukaBlocks/DeleteTalukaBlock?Id=' + (delDataObj.id || 0)+'&lan='+this.lang, false, delDataObj, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.getTableData();
              // this.clearForm();
              // this.editFlag = false;
            } else {
              this.commonMethod.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorHandler.handelError(error.status);
          },
        });
      }
      this.highLightRowFlag = false;
    });
  }

  addcircle(obj?:any){
    const dialogRef = this.dialog.open(AddcircleComponent,{
      width: '30%',
      data: obj,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes'? this.getTableData() : '';
      this.highLightRowFlag = false;
      //this.setTableData();
    });
  }

  clearFilter(){
    this.textsearch.setValue('');
    this.getTableData();
    this.pageNumber = 1;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}

