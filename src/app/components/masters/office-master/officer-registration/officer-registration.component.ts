import { Component, OnDestroy, ViewChild } from '@angular/core';
import { RegisterOfficerComponent } from './register-officer/register-officer.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-officer-registration',
  templateUrl: './officer-registration.component.html',
  styleUrls: ['./officer-registration.component.scss']
})
export class OfficerRegistrationComponent implements OnDestroy {
  pageNumber: number = 1;
  totalPages!: number;
  tableDataArray: any;
  tableDatasize!: number;
  highLightedFlag: boolean = true;
  subscription!: Subscription;
  lang: string = 'English';
  filterForm!: FormGroup;
  designationArray = new Array();
  departmentArray = new Array();
  departmentLevelArray = new Array();
  talukaArray = new Array();
  blockArray = new Array();
  circleArray = new Array();
  // villageArray = new Array();
  @ViewChild('formDirective') private formDirective!: NgForm;
  filterFlag: boolean = false;
  objId: any;
  pageAccessObject: object | any;
  grampanchayatArray = new Array();
  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    public validation: ValidationService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
    private WebStorageService: WebStorageService,
    private masterService: MasterService,

  ) { }

  ngOnInit() {
    this.WebStorageService.getAllPageName().filter((ele: any) => { return ele.pageName == 'Officer Registration' ? this.pageAccessObject = ele : '' })
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      this.setTableData();
    })
    this.getFilterFormData();
    this.getDepartment();
    // this.getDepartmentLevel();
    this.getTaluka();
    this.getBlock();
    this.getCircle();
    this.bindTable();
  }

  getFilterFormData() {
    this.filterForm = this.fb.group({
      departmentId: [0],
      departmentLevelId: [0],
      designationId: [0],
      talukaId: [0],
      blockId: [0],
      circleId: [0],
      grampanchayatId: [0],
      searchtext: ['']
    })
  }

  get f() { return this.filterForm.controls; }

  getDepartment() {
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        this.departmentArray = res.responseData;
      }), error: (() => {
        this.departmentArray = [];
      })
    })
  }

  getDepartmentLevel() {
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        this.departmentLevelArray = res.responseData;
      }), error: (() => {
        this.departmentLevelArray = [];
      })
    })
  }

  getDesignation() {
    let deptId = this.filterForm.getRawValue().departmentId;
    let deptLevelId = this.filterForm.getRawValue().departmentLevelId;
    if (deptId != 0) {
      this.masterService.GetDesignationDropDownOnDeptLevel((deptId || 0),(deptLevelId||0)).subscribe({
        next: ((res: any) => {
          this.designationArray = res.responseData;
        }), error: (() => {
          this.designationArray = [];
        })
      })
    }
  }

  getTaluka() {
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
      }), error: (() => {
        this.talukaArray = [];
      })
    })
  }

  getBlock() {
    this.masterService.GetAllBlock(1, 1).subscribe({
      next: ((res: any) => {
        this.blockArray = res.responseData;
      }), error: (() => {
        this.blockArray = [];
      })
    })
  }

  getCircle() {
    this.masterService.GetAllCircle(1, 1, 0).subscribe({
      next: ((res: any) => {
        this.circleArray = res.responseData;
      }), error: (() => {
        this.circleArray = [];
      })
    })
  }

  getGrampanchayat() {
    let talukaId = this.filterForm.getRawValue().talukaId;
    this.masterService.GetGrampanchayat(talukaId || 0).subscribe({
      next: ((res: any) => {
        this.grampanchayatArray = res.responseData;
      }), error: (() => {
        this.grampanchayatArray = [];
      })
    })
  }

  bindTable(flag?: any) {
    this.spinner.show();
    let formData = this.filterForm.value;
    flag == 'filter' ? this.pageNumber = 1 : ''
    let str = `&PageNo=${this.pageNumber}&PageSize=10`;
    this.apiService.setHttp('GET', 'sericulture/api/UserRegistration/get-user-details?VillageId=' + (formData.villageId || 0) + '&TalukaId=' + (formData.talukaId || 0) + '&DepartmentLevelId=' + (formData.departmentLevelId || 0) + '&DepartmentId=' + (formData.departmentId || 0) + '&DesignationId=' + (formData.designationId || 0) + '&CircleId=' + (formData.circleId || 0) + '&BlockId=' + (formData.blockId || 0) + '&SearchText=' + (formData.searchtext || '') + '&' + str + '&lan=' + this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData.responseData1;
          this.tableDatasize = res.responseData.responseData2?.totalCount;
          this.totalPages = res.responseData.responseData2?.totalPages;
        } else {
          this.spinner.hide();
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
    let displayedColumns = this.lang == 'en' ? ['srNo', 'name', 'departmentName', 'departmentLevel', 'designationName', 'mobNo1', 'emailId', 'action']
      : ['srNo', 'm_Name', 'm_DepartmentName', 'm_DepartmentLevel', 'm_DesignationName', 'mobNo1', 'emailId', 'action'];
    let displayedheaders = this.lang == 'en' ? ['Sr. No.', 'Officer Name', 'Department', 'Department Level', 'Designation', 'Mobile No.', 'Email', 'Action'] :
      ['अनुक्रमांक', 'अधिकाऱ्याचे नाव', 'विभाग', 'विभाग स्तर', 'पदनाम', 'मोबाईल नंबर', 'ईमेल', 'कृती'];
    let tableData = {
      pageNumber: this.pageNumber,
      pagination: this.tableDatasize > 10 ? true : false,
      highlightedrow: true,
      displayedColumns: displayedColumns,
      tableData: this.tableDataArray,
      tableSize: this.tableDatasize,
      tableHeaders: displayedheaders,
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
        this.pageNumber = obj.pageNumber;
        !this.filterFlag ? this.formDirective.resetForm() : ''
        this.bindTable();
        this.getFilterFormData();
        break;
      case 'Edit':
        this.registerofficer(obj);
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
      case 'View':
        this.registerofficer(obj);
        obj.label == 'View' ? this.objId = obj.id : 0;
        break;
    }
  }

  registerofficer(obj?: any) {
    let dialogRef = this.dialog.open(RegisterOfficerComponent, {
      width: '800px',
      data: obj,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.bindTable() : '';
      this.highLightedFlag = false;
    });
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: this.lang == 'en' ? 'Do You Want To Delete Selected Officer ?' : 'तुम्हाला निवडलेल्या अधिकाऱ्याला हटवायचे आहे का? ?',
      header: this.lang == 'en' ? 'Delete Officer' : 'अधिकारी हटवा',
      okButton: this.lang == 'en' ? 'Delete' : 'हटवा',
      cancelButton: this.lang == 'en' ? 'Cancel' : 'रद्द करा',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('put', 'sericulture/api/UserRegistration/delete-user-details?Id=' + delObj.id + '&lan=' + this.lang, false, false, false, 'masterUrl');
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

  clearFilter() {
    this.formDirective.resetForm();
    this.pageNumber = 1;
    this.getFilterFormData();
    this.bindTable();
  }

  clearDropDown(flag?: any) {
    if (flag == 'dept') {
      this.departmentLevelArray = [];
      this.f['departmentLevelId'].setValue(0);
      this.designationArray = [];
      this.f['designationId'].setValue(0);
    }else if(flag == 'clearAll'){
      // this.departmentArray = [];
      // this.f['departmentId'].setValue(0);
      this.designationArray = [];
      this.f['designationId'].setValue(0);
    } else {
      this.grampanchayatArray = [];
      this.f['grampanchayatId'].setValue(0);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}

