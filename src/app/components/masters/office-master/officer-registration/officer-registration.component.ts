import { Component } from '@angular/core';
import { RegisterOfficerComponent } from './register-officer/register-officer.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
//import { MasterService } from 'src/app/core/services/master.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';

@Component({
  selector: 'app-officer-registration',
  templateUrl: './officer-registration.component.html',
  styleUrls: ['./officer-registration.component.scss']
})
export class OfficerRegistrationComponent {
  pageNumber: number = 1;
  totalPages!: number;
  tableDataArray: any;
  tableDatasize!: number;
  highLightedFlag:boolean = true;

  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    public validation: ValidationService,
    private spinner: NgxSpinnerService,
    // private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
  //  private WebStorageService:WebStorageService
   ) {}

   ngOnInit(){
    this.bindTable();
   }

 

  bindTable(flag?: any) {
   console.log("flag",flag)
    this.spinner.show();
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/UserRegistration/get-user-details?' + str, false, false, false, 'masterUrl');
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
    this.highLightedFlag = true;
     let displayedColumns = ['srNo', 'departmentName', 'departmentLevel','designationName', 'taluka','village','blockName','circleName','mobNo1','emailId','action'];
     let displayedheaders = ['Sr. No.', 'Department','Department Level','Designation','Taluka','Village','Block','Circle','Mobile No.','Email','Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      delete: true, view: false, edit: true,
    };
    this.highLightedFlag? tableData.highlightedrow=true :tableData.highlightedrow=false;
   this.apiService.tableData.next(tableData);
  }


  childCompInfo(obj: any) {
   switch (obj.label) {
      case 'Pagination':
        //this.searchDataFlag ? (this.f['deptId'].setValue(this.filterFrm.value?.deptId), this.f['deptLevelId'].setValue(this.filterFrm.value?.deptLevelId), this.f['textSearch'].setValue(this.filterFrm.value?.textSearch)) : (this.f['deptId'].setValue(''), this.f['deptLevelId'].setValue(''), this.f['textSearch'].setValue(''));
        this.pageNumber = obj.pageNumber;
       // this.clearMainForm();//when we click on edit button & click on pagination that time clear form 
        this.bindTable();
        break;
       case 'Edit':
         this.registerofficer(obj);
        break;
      case 'Delete':
        // this.deleteDialogOpen(obj);
        break;
    }
  }

 



  registerofficer(obj?:any){
    let dialogRef = this.dialog.open(RegisterOfficerComponent, {
      width: '700px',
      data: obj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.bindTable() : '';
      this.highLightedFlag= false;
      this.setTableData();
    });
   }

}

