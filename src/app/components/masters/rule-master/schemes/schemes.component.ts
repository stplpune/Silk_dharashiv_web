import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MasterService } from 'src/app/core/services/master.service';
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
  ) {}

  ngOnInit(){
   this.data ? this.onEditData() : this.getFormData();
    this.getState(); 
    this.getTableData();

  }
  // {
  //    "id": 11,
      // "schemeName": "ddsf",
      // "m_SchemeName": "शेती",
      // "stateId": 1,
      // "stateName": "Maharashtra",
      // "m_StateName": "महाराष्ट्र",
      // "districtId": 1,
      // "districtName": "Osmanabad",
      // "m_DistrictName": "उस्मानाबाद",
      // "schemeInfo": "sfsdf",
      // "status": "Active",
      // "createdBy": 1
  // }

  getFormData(data?:any){
    console.log('data123',data);
    this.schemeForm=this.fb.group({
      schemeType:['',data ? this.data.schemeName : ''],
      stateId:['',data ? this.data.stateId : ''],
      districtId:['',data ? this.data.districtId : ''],
      logoPath:['',data ? this.data.logoPath : ''],
      schemeInfo:['',data ? this.data.schemeInfo : ''],
      m_SchemeType:['',data ? this.data.m_SchemeName : '']
    })
  }

  getState() {
    this.master.GetAllState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
        this.editFlag && this.data ? (this.schemeForm.controls['stateId'].setValue(this.data?.stateId),this.getDisrict()) : '';
      }), error: (() => {
        this.stateArray = []
      })
    })
  }	

  getDisrict() {
    let distId=this.schemeForm.value.stateId
    this.master.GetAllDistrict(distId || 0).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        this.editFlag && this.data ? this.schemeForm.controls['districtId'].setValue(this.data?.districtId) : '';
      }), error: (() => {
        this.districtArray = []
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
          console.log('this.imageResponse',this.imageResponse);
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
            this.editFlag=false;
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


  getTableData(){
    let searchValue=this.filterForm.value 
    this.spinner.show();
    this.apiService.setHttp('GET','sericulture/api/Scheme/get-All-Scheme?PageNo=1&PageSize=10&TextSearch='+searchValue, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next:((res:any)=>{
        if(res.statusCode == '200'){
          this.spinner.hide();
          this.tableDataArray = res.responseData;
          this.totalCount = res.responseData1.totalCount;
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
    this.tableObj = {
      pageNumber: this.pageNumber,
      isBlock: '',
      status: '',
      displayedColumns:['srNo', 'schemeName','stateName','districtName','status','action'],
      tableData: this.tableDataArray,
      tableSize: this.totalCount,
      tableHeaders:['Sr. No.','Scheme Name','State Name','District Name','Status','Action'],
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

}
