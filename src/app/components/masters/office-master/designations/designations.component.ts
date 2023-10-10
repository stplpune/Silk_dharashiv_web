import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { MasterService } from 'src/app/core/services/master.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})
export class DesignationsComponent {
  filterFrm !: FormGroup;
  designationFrm !: FormGroup;
  pageNumber: number = 1;
  totalPages!: number;
  tableDataArray: any;
  tableDatasize!: number;
  highLightedFlag:boolean = true;
  departmentArray = new Array();
  departmentArrayAdd = new Array();
  departmentLevelArray = new Array();
  departmentLevelAddArray = new Array();
  editFlag: boolean = false;
  searchDataFlag: boolean = false;//used for filter
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    public validation: ValidationService,
    private spinner: NgxSpinnerService,
    private masterService: MasterService,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
    public dialog: MatDialog,
    private WebStorageService:WebStorageService
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
       this.setTableData();
    })
    this.getDepartment();
    this.getDepartmentLevel();
    this.filterDefaultFrm();
    this.addDefaultFrm();
    this.bindTable();
  }

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      deptId: [0],
      deptLevelId: [0],
      textSearch: ['']
    })
  }

  addDefaultFrm(data?: any) {
    this.designationFrm = this.fb.group({
      "id": [data ? data.id : 0],
      "designationName": [data ? data.designationName : '',[Validators.required, Validators.maxLength(50), Validators.pattern(this.validation.alphabetWithSpace)]],
      "m_DesignationName": [data ? data.m_DesignationName : '',[Validators.required,Validators.maxLength(50), Validators.pattern(this.validation.marathi)]],
      "departmentId": [data ? data.departmentId : '',[Validators.required]],
      "departmentLevelId": [data ? data.departmentLevelId : '',[Validators.required]],
       })
   }

  get a() { return this.designationFrm.controls }

  get f() { return this.filterFrm.controls }

  //#region ----------dropdown code start here-------------------------
  getDepartment() {
    this.departmentArray = []; this.departmentArrayAdd = [];
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentArray = res.responseData;
          this.departmentArrayAdd = res.responseData;
        }
        else {
          this.departmentArray = []; this.departmentArrayAdd = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }

  getDepartmentLevel() {
    this.departmentLevelArray = []; this.departmentLevelAddArray = [];
    this.masterService.GetDeptLevelDropDown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentLevelArray = res.responseData;
          this.departmentLevelAddArray = res.responseData;
        }
        else {
          this.departmentLevelArray = []; this.departmentLevelAddArray = [];
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      })
    })
  }
//#endregion-----------dropdown code end here-----------------

  onEditData(obj: any) {
    this.editFlag = true;
    this.addDefaultFrm(obj);
  }

  onSubmit() {
    if (this.designationFrm.invalid) {
      return;
    }
    else {
      this.spinner.show();
      let data = this.designationFrm.getRawValue();
      data.id = Number(data.id)
      let mainData = {...data,"createdBy":this.WebStorageService.getUserId()};
      this.apiService.setHttp('post', 'sericulture/api/Designation/Insert-Update-Designation?lan='+ this.lang, false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage,0);
            this.bindTable();
            this.clearMainForm();
          } else {
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.errorHandler.handelError(error.statusCode);
        }
      });
    }
  }

  bindTable(flag?: any) {
    this.spinner.show();
    flag == 'filter' ? (this.searchDataFlag = true,this.clearMainForm(), (this.pageNumber = 1)) : '';
    let formData = this.filterFrm?.getRawValue();
    // flag == 'filter' ? this.clearMainForm() : ''; //when we click on edit button and search record that time clear form 
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
    let displayedColumns = this.lang == 'mr-IN' ? ['srNo', 'm_DepartmentName', 'm_DepartmentLevel','designationName', 'm_DesignationName', 'action'] : ['srNo', 'departmentName', 'departmentLevel','designationName', 'm_DesignationName', 'action']
    let displayedheaders = this.lang == 'mr-IN' ? ['अनुक्रमणिका', 'विभाग', 'पदनाम स्तर', 'पदनाम(इंग्रजी)', 'पदनाम(मराठी)', 'कृती'] : ['Sr. No.', 'Department', 'Department Level', 'Designation(English)','Designation(Marathi)', 'Action'];
  //  let displayedColumns = ['srNo', 'departmentName', 'departmentLevel','designationName', 'm_DesignationName', 'action'];
   // let displayedheaders = ['Sr. No.', 'Department Name', 'Department Level Name', 'Designation Name','Designation Name In Marathi', 'Action'];
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
        this.searchDataFlag ? (this.f['deptId'].setValue(this.filterFrm.value?.deptId), this.f['deptLevelId'].setValue(this.filterFrm.value?.deptLevelId), this.f['textSearch'].setValue(this.filterFrm.value?.textSearch)) : (this.f['deptId'].setValue(''), this.f['deptLevelId'].setValue(''), this.f['textSearch'].setValue(''));
        this.pageNumber = obj.pageNumber;
        this.clearMainForm();//when we click on edit button & click on pagination that time clear form 
        this.bindTable();
        break;
       case 'Edit':
        this.onEditData(obj);
        break;
      case 'Delete':
        this.deleteDialogOpen(obj);
        break;
    }
  }

  //clear add form functionality here
  clearMainForm() {
    this.formDirective?.resetForm();
    this.addDefaultFrm();
    this.editFlag = false;
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
      okButton:  this.lang == 'mr-IN' ? 'डिलीट' : 'Delete',
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
        this.apiService.setHttp('delete', 'sericulture/api/Designation/DeleteDesignation?Id=' + delObj.id +'&lan='+this.lang, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethod.snackBar(res.statusMessage, 0);
              this.bindTable();
              this.editFlag ? this.clearMainForm() : ''; //when we click on edit button and delete record that time clear form code 
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
      //this.setTableData();
    });
  }
}


















































 // getDepartmentLevelForAdd() {
  //   this.masterService.GetDeptLevelDropDown().subscribe({
  //     next: ((res: any) => {
  //       if (res.statusCode == "200" && res.responseData?.length) {
  //         this.departmentLevelAddArray = res.responseData;
  //       }
  //       else {
  //         this.departmentLevelAddArray = [];
  //         this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
  //       }
  //     })
  //   })
  // }





