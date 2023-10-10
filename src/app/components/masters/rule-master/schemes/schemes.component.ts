import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})
export class SchemesComponent {

  totalCount: number | any;
  tableDataArray = new Array();
  tableObj: object|any;
  highLightedFlag:boolean = true;
  pageNumber: number =1;
  filterForm = new FormControl('');
  schemeForm!:FormGroup;
  stateArray = new Array();
  districtArray = new Array();
  imageResponse:  string = '';
  @ViewChild('uplodLogo')clearlogo!: any;
  data:any;
  editFlag:boolean=false;
  @ViewChild('formDirective') private formDirective!: NgForm;
  filtarFlag:boolean=false;
  subscription!: Subscription;
  lang: string = 'English';

  constructor
  (
    private spinner:NgxSpinnerService,
    private apiService:ApiService,
    private errorService:ErrorHandlingService,
    private commonMethodService:CommonMethodsService,
    private fb:FormBuilder,
    private master:MasterService,
    private fileUpl:FileUploadService,
    private WebStorageService:WebStorageService,
    public dialog: MatDialog,
    public validator: ValidationService,
  ) {}

  ngOnInit(){
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
       this.setTableData();
    })
   this.data ? this.onEditData() : this.getFormData();
    this.getState(); 
    this.getTableData();

  }
 
  getFormData(data?:any){
    console.log('data123',data);
    this.schemeForm=this.fb.group({
      schemeType:[data ?data.schemeName : '',[Validators.required,Validators.pattern(this.validator.alphaNumericWithSpace)]],
      stateId:[data ? data.stateId : 1],
      districtId:[data ? data.districtId : 1],
      logoPath:[data ? data.logoPath : ''],
      schemeInfo:[data ?data.schemeInfo : '',[Validators.required]],
      m_SchemeType:[data ?data.m_SchemeName : '',[Validators.required,Validators.pattern(this.validator.marathi)]]
    })
    this.imageResponse = this.data ? this.data.logoPath : '';
  }

  get f() { return this.schemeForm.controls };

  getState() {
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
         this.data ? (this.schemeForm.controls['stateId'].setValue(this.data?.stateId),this.getDisrict()) : this.getDisrict();
      }), error: (() => {
        this.stateArray = [];
      })
    })
  }	

  getDisrict() {
    // let distId=1
    this.master.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.data ? this.schemeForm.controls['districtId'].setValue(this.data?.districtId) : '';
      }), error: (() => {
        this.districtArray = [];
      })
    })
  }	

  imageUplod(event:any){
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.imageResponse=res.responseData;
        }
        else {
          this.imageResponse = "";
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.commonMethodService.checkDataType(error.status) == false ? this.errorService.handelError(error.statusCode) : this.commonMethodService.snackBar(error.statusText, 1);
      }
    })
  }

  viewimage(){
    window.open(this.imageResponse, '_blank')
  }

  deleteImage(){
    this.imageResponse="";
    this.clearlogo.nativeElement="";
  }

  onSubmitData(){
    let formData=this.schemeForm.value;
    console.log('this.imggg',this.imageResponse);
    this.spinner.show();
    if(this.schemeForm.invalid){
      this.spinner.hide();
      return
    }else {
      formData.id=this.data ? this.data.id : 0;
      formData.logoPath=this.imageResponse;
      let mainData = {...formData,"createdBy":this.WebStorageService.getUserId()};
      console.log('mainData',mainData);
      this.apiService.setHttp('post', 'sericulture/api/Scheme/Insert-Update-Scheme', false, mainData, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == '200') {
            this.spinner.hide();
            this.commonMethodService.snackBar(res.statusMessage, 0)
            this.getTableData();
            this.formDirective.resetForm();
            this.clearlogo.nativeElement = "";
            this.imageResponse="";
            this.data=null;
            this.filterForm.reset();
          } else {
            this.spinner.hide();
            this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.spinner.hide();
          this.errorService.handelError(error.status);
        }
      })
    }
  }


  getTableData(flag?:any){
    let searchValue=this.filterForm.value || ''
    this.spinner.show();
    flag == 'filter' ? (this.pageNumber = 1,this.schemeForm.reset(),this.clearlogo.nativeElement="") : '';
    this.apiService.setHttp('GET','sericulture/api/Scheme/get-All-Scheme?PageNo='+this.pageNumber+'&PageSize=10&TextSearch='+searchValue, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next:((res:any)=>{
        if(res.statusCode == '200'){
          this.spinner.hide();
          this.tableDataArray = res.responseData;
          this.totalCount = res.responseData1.totalPages;
        }else{
          this.spinner.hide();
          this.tableDataArray = [];
          this.totalCount = 0;
          this.commonMethodService.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonMethodService.snackBar(res.statusMessage, 1);
        }
        this.setTableData();
      }),
      error: (err:any) => {
        this.spinner.hide();
        this.tableDataArray = [];
        this.totalCount = 0;
        this.errorService.handelError(err.status)
      }
    })
  }
 
  setTableData(){
    this.highLightedFlag = true;
    let displayedColumns = this.lang == 'en' ? ['srNo', 'schemeName','stateName','districtName','status','action'] : ['srNo', 'm_SchemeName','m_StateName','m_DistrictName','status','action']
    let tableHeaders = this.lang == 'en' ? ['Sr. No.','Scheme Name','State Name','District Name','Status','Action'] : ['अनुक्रमांक','योजनेचे नाव','राज्यांचे नाव','जिल्ह्याचे नाव','स्थिती','क्रिया']
    this.tableObj = {
      pageNumber: this.pageNumber,
      isBlock: '',
      status: '',
      tableData: this.tableDataArray,
      tableSize: this.totalCount,
      tableHeaders: tableHeaders,
      displayedColumns:displayedColumns,
      pagination: this.totalCount > 10 ? true : false,
      view:true,
      edit: true,
      delete:true,
      reset:false
    }
    this.highLightedFlag? this.tableObj.highlightedrow=true : this.tableObj.highlightedrow=false;
    this.apiService.tableData.next(this.tableObj);
  }

  childCompInfo(obj: any) {
    switch (obj.label) {
       case 'Pagination':
        this.pageNumber = obj.pageNumber;
        !this.filtarFlag ? this.filterForm.reset() : ''
        this.getTableData();
         break;
        case 'Edit':
         this.onEditData(obj);
         break;
       case 'Delete':
         this.deleteDialogOpen(obj);
         break;
     }
   }

  onEditData(editData?:any){
    this.data = editData;
    this.getFormData(editData);
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: 'Do You Want To Delete Selected Scheme ?',
      header: 'Delete',
      okButton: 'Delete',
      cancelButton: 'Cancel',
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        this.apiService.setHttp('delete', 'sericulture/api/Scheme/DeleteScheme?Id='+delObj.id, false, false, false, 'masterUrl');
        this.apiService.getHttp().subscribe({
          next: (res: any) => {
            if (res.statusCode == '200') {
              this.commonMethodService.snackBar(res.statusMessage, 0);
              this.getTableData();
              // this.editFlag ? this.clearMainForm() : ''; //when we click on edit button and delete record that time clear form code 
            } else {
              this.commonMethodService.snackBar(res.statusMessage, 1);
            }
          },
          error: (error: any) => {
            this.errorService.handelError(error.statusCode);
          },
        });
      }
      this.highLightedFlag = false;
      //this.setTableData();
    });
  }

  clearForm(){
    this.formDirective.resetForm({
      stateId:1,
      districtId:1
    });
    this.clearlogo.nativeElement="";
    this.imageResponse="";
    this.data=null;
  }

  clearFilter(){
    this.filterForm.reset();
    this.getTableData();
  }

}
