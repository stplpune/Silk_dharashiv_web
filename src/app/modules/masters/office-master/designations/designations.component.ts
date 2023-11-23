import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { MasterService } from 'src/app/core/services/master.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
import { AddDesignationComponent } from './add-designation/add-designation.component';
@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent implements OnDestroy {
  filterFrm !: FormGroup;

  pageNumber: number = 1;
  totalPages!: number;
  tableDataArray: any;
  tableDatasize!: number;
  highLightedFlag: boolean = true;
  departmentArray = new Array();
  departmentLevelArray = new Array();
  subscription!: Subscription;//used  for lang conv
  lang: any;
  pageAccessObject: object | any;
  searchDataFlag: boolean = false
  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    public validation: ValidationService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
    public dialog: MatDialog,
    private WebStorageService: WebStorageService
  ) { }

  ngOnInit() {
    this.WebStorageService.getAllPageName().filter((ele: any) => { return ele.pageName == "Designation" ? this.pageAccessObject = ele : '' })

    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.getDepartment();
    this.getDepartmentLevel();
    this.filterDefaultFrm();
    this.bindTable();
    // this.lang = this.WebStorageService.setLanguageCallback();//testing code lang for common
    // this.setTableData();
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      deptId: [0],
      deptLevelId: [0],
      textSearch: ['']
    })
  }


  get f() { return this.filterFrm.controls }

  //#region ----------dropdown code start here-------------------------
  getDepartment() {
    this.departmentArray = [];
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentArray = res.responseData;
          this.departmentArray.unshift({ "id": 0, "textEnglish": "All Department", "textMarathi": "सर्व विभाग" });
        }
        else {
          this.departmentArray = [];
        }
      })
    })
  }

  getDepartmentLevel() {
    this.departmentLevelArray = [];
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentLevelArray = res.responseData;
          this.departmentLevelArray.unshift({ "id": 0, "textEnglish": "All Designation Level", "textMarathi": "सर्व पदनाम स्तर" });
        }
        else {
          this.departmentLevelArray = [];
        }
      })
    })
  }
  //#endregion-----------dropdown code end here-----------------
  bindTable(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? (this.searchDataFlag = true, this.pageNumber = 1) : '';
    let formData = this.filterFrm?.getRawValue();
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', `sericulture/api/Designation/get-All-Designation?DeptId=${formData?.deptId || 0}&Deptlevel=${formData?.deptLevelId || 0}&lan=${this.lang}&TextSearch=${formData?.textSearch || ''}` + str, false, false, false, 'masterUrl');
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_DepartmentName', 'm_DepartmentLevel', 'm_DesignationName', 'action'] : ['srNo', 'departmentName', 'departmentLevel', 'designationName', 'action']
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमांक', 'विभाग', 'पदनाम स्तर', 'पदनाम', 'कृती'] : ['Sr. No.', 'Department', 'Designation Level', 'Designation', 'Action'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
      // delete: true, view: true, edit: true,
      view: this.pageAccessObject?.readRight == true ? true : false,
      edit: this.pageAccessObject?.writeRight == true ? true : false,
      delete: this.pageAccessObject?.deleteRight == true ? true : false
    };
    this.highLightedFlag ? tableData.highlightedrow = true : tableData.highlightedrow = false;
    this.apiService.tableData.next(tableData);
  }


  childCompInfo(obj: any) {
    switch (obj.label) {
      case 'Pagination':
        this.searchDataFlag ? '' : (this.filterFrm.controls['deptId'].setValue(''), this.filterFrm.controls['deptLevelId'].setValue(''), this.filterFrm.controls['textSearch'].setValue(''));
        this.pageNumber = obj.pageNumber;
        this.bindTable();
        break;
      case 'Edit':
        this.addDesignation(obj);
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
      case 'View':
        this.addDesignation(obj);
        break;
    }
  }

  addDesignation(obj?: any) {
    console.log('obj', obj);
    let dialogRef = this.dialog.open(AddDesignationComponent, {
      width: '400px',
      data: obj,
      disableClose: true,
      autoFocus: true,
    })
    dialogRef.afterClosed().subscribe((result: any) => {

      if (result == 'Yes') {
        this.formDirective?.resetForm();
        this.filterDefaultFrm();
        this.pageNumber = 1;
        this.bindTable()
      }
      this.highLightedFlag = false;
    });
  }


  //clear filter form functionality here
  clearForm() {
    this.filterDefaultFrm();
    this.bindTable();
  }


  //delete functionality here
  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'mr-IN' ? 'तुम्ही निवडलेले पदनाम रेकॉर्ड हटवू इच्छिता?' : 'Do You Want To Delete Selected Designation ?',
      header: this.lang == 'mr-IN' ? 'डिलीट करा' : 'Delete',
      okButton: this.lang == 'mr-IN' ? 'डिलीट' : 'Delete',
      cancelButton: this.lang == 'mr-IN' ? 'रद्द करा' : 'Cancel',
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
        this.apiService.setHttp('delete', 'sericulture/api/Designation/DeleteDesignation?Id=' + delObj.id + '&lan=' + this.lang, false, false, false, 'masterUrl');
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}




