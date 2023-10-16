import { Component } from '@angular/core';
import { AddBlogsComponent } from './add-blogs/add-blogs.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent {
  filterForm = new FormControl('');
  pageNumber: number = 1;
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  tableDataArray = new Array();
  textsearch = new FormControl('');
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    private errorHandler: ErrorHandlingService,
    public dialog: MatDialog,
    public webStorage: WebStorageService
  
  ) { }

  ngOnInit() {  
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.getTableData();
  }
 

  getTableData(flag?: any) {
    this.spinner.show();
    this.pageNumber = flag == 'filter' ? 1 : this.pageNumber;
    // flag == 'filter' ? (this.pageNumber = 1) : '';         
    this.apiService.setHttp('GET', `sericulture/api/Blogs/get-blogs-details?SeacrhText=${this.textsearch.value || ''}&PageNo=${this.pageNumber}&PageSize=10`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2?.totalCount;
          this.totalPages = res.responseData.responseData2?.totalPages;
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'thumbnailImage','title','publishDate','status','action'] : ['srNo', 'thumbnailImage','title','publishDate','status','action'];
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'लघुप्रतिमा','शीर्षक','प्रकाशित तारीख','स्थिती','कृती'] : ['Sr. No.', 'Thumbnail Image','Tittle','Publish Date','Status','Action'];
    let getTableData = {
      pageNumber: this.pageNumber,
      date: 'publishDate',
      img: 'thumbnailImage',
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      delete: true, edit: true,
    };
    this.highLightRowFlag ? (getTableData.highlightedrow = true) : (getTableData.highlightedrow = false);
    this.apiService.tableData.next(getTableData);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.pageNumber = obj.pageNumber;
        // this.clearForm();
        this.getTableData();
        break;
      case 'Edit':
        this.addblogs(obj);      
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
    }
  }

  globalDialogOpen(delDataObj?: any) {
    let dialogObj = {
      title: 'Do You Want To Delete Blog?',
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
        this.apiService.setHttp('DELETE', 'sericulture/api/Blogs/delete-blogs?blogId=' + (delDataObj.id || 0), false, delDataObj, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethod.snackBar(res.statusMessage, 0);          
              this.getTableData();
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

  addblogs(obj?:any){
    const dialogRef = this.dialog.open(AddBlogsComponent,{
      width: '60%',
      data: obj,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes'? this.getTableData() : '';
      this.highLightRowFlag = false;
      this.setTableData();
    });
  }

  clearFilter(){
    this.textsearch.setValue('');
    this.getTableData();
    this.pageNumber = 1;
  }
}
