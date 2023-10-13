import { Component } from '@angular/core';
import { SetRuleModalComponent } from './set-rule-modal/set-rule-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';

@Component({
  selector: 'app-set-rule',
  templateUrl: './set-rule.component.html',
  styleUrls: ['./set-rule.component.scss']
})
export class SetRuleComponent {

  tableresp= new Array();
  constructor(public dialog: MatDialog,
    private apiService:ApiService,
    private spinner:NgxSpinnerService,
    private error:ErrorHandlingService,
    ) {}

// displayedColumns: string[] = ['srno', 'scheme', 'department', 'action'];
// dataSource = ELEMENT_DATA;
ngOnInit(){
this.bindTable()
}

setrules(){
  this.dialog.open(SetRuleModalComponent,{
    width:'65%'
  })
}


bindTable() {
  // this.spinner.show();
  // flag == 'filter' ? (this.searchDataFlag = true, this.clearMainForm(), (this.pageNumber = 1)) : this.searchDataFlag = false;
  // let formData = this.filterFrm?.getRawValue();
  // let str = `&PageNo=${this.pageNumber}&PageSize=10`;
  this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetAllApprovalMasterLevels?SchemeTypeId=1&DepartmentId=1&StateId=1&DistrictId=1' , false, false, false, 'masterUrl');
  this.apiService.getHttp().subscribe({
    next: (res: any) => {
      console.log(res);
      
      this.spinner.hide();
      if (res.statusCode == '200') {
        this.tableresp = res.responseData;
        // this.tableDatasize = res.responseData1?.totalCount;
        // this.totalPages = res.responseData1?.totalPages;
      } else {
         this.tableresp = []; 
        //  this.tableDatasize = 0;
      }
      this.setTableData();
    },
    error: (err: any) => {
      this.spinner.hide();
      this.error.handelError(err.status);
    },
  });
}

childCompInfo(obj: any) {
  switch (obj.label) {
    case 'Pagination':
      // this.searchDataFlag ? (this.f['deptId'].setValue(this.filterFrm.value?.deptId), this.f['deptLevelId'].setValue(this.filterFrm.value?.deptLevelId), this.f['textSearch'].setValue(this.filterFrm.value?.textSearch)) : (this.f['deptId'].setValue(''), this.f['deptLevelId'].setValue(''), this.f['textSearch'].setValue(''));
      // this.pageNumber = obj.pageNumber;
      // this.clearMainForm();//when we click on edit button & click on pagination that time clear form 
      this.bindTable();
      break;
    case 'Edit':
      // this.onEditData(obj);
      break;
    case 'Delete':
      // this.deleteDialogOpen(obj);
      break;
  }
}


setTableData() {
  // this.highLightedFlag = true;
  let displayedColumns =  ['srNo', 'state', 'district','schemeType','departmentName', 'action'] 
  let displayedheaders =  ['Sr No', 'State', 'District', 'Scheme', 'Department','Action'] ;
  let tableData = {
    // pageNumber: this.pageNumber,
    // pagination: this.tableDatasize > 10 ? true : false,
    highlightedrow: true,
    displayedColumns: displayedColumns,
    tableData: this.tableresp,
    // tableSize: this.tableDatasize,
    tableHeaders: displayedheaders,
    delete: true, view: false, edit: true,
  };
  // this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;
  this.apiService.tableData.next(tableData);
}


}
