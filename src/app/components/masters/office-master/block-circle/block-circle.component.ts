import { Component} from '@angular/core';
import { AddcircleComponent } from './addcircle/addcircle.component';
import { MatDialog} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { FormControl } from '@angular/forms';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';

@Component({
  selector: 'app-block-circle',
  templateUrl: './block-circle.component.html',
  styleUrls: ['./block-circle.component.scss']
})
export class BlockCircleComponent {


  displayedColumns: string[] = ['srno', 'type','blockcirclename', 'action'];
  dataSource = ELEMENT_DATA;

  pageNumber: number = 1;
  tableDatasize!: number;
  totalPages!: number;
  highLightRowFlag: boolean = false;
  tableDataArray = new Array();
  textsearch = new FormControl('');

  constructor(

    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    // private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    public dialog: MatDialog
  
  ) { }

  ngOnInit() {  
    this.getTableData();
  
    
  }
 

  getTableData(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? (this.pageNumber = 1) : '';   
    // let str = `&PageNo=${this.pageNumber}&PageSize=10`;        &TextSearch=test
    this.apiService.setHttp('GET', `sericulture/api/TalukaBlocks/GetAllTalukaBlocks?pageno=${this.pageNumber}&pagesize=10`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData;
          console.log("tableDataArray",this.tableDataArray);
          
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
    let displayedColumns = ['srNo', 'blockName','action'];
    let displayedheaders = ['Sr. No.', 'Block Name','Action'];
    let getTableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      delete: true, view: false, edit: true,
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
        this.addcircle(obj);      
        break;
      case 'Delete':
        this.globalDialogOpen(obj);
        break;
    }
  }

  globalDialogOpen(delDataObj?: any) {
    let dialogObj = {
      title: 'Do You Want To Delete Block?',
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
        // https://demosilkapi.mahamining.com/sericulture/api/TalukaBlocks/DeleteTalukaBlock?Id=1
        this.apiService.setHttp('DELETE', 'sericulture/api/TalukaBlocks/DeleteTalukaBlock?Id=' + (delDataObj.id || 0), false, delDataObj, false, 'masterUrl');
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
      width: '50%',
      data: obj,
      // disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes'? this.getTableData() : '';
      this.highLightRowFlag = false;
      this.setTableData();
    });
  }

}





export interface PeriodicElement {
  srno: number;
  type: string;
  blockcirclename: string;
  action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, type: 'Hydrogen', blockcirclename:'District Level', action: ' '},
  {srno: 2, type: 'Hydrogen', blockcirclename:'Taluka Level', action: ' '}
];
