import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from 'src/app/core/services/validation.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { GeoTaggingComponent } from './geo-tagging/geo-tagging.component';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
  styleUrls: ['./approval-process.component.scss']
})
export class ApprovalProcessComponent implements OnDestroy {
  approvalFrm !: FormGroup;
  applicationData: any;
  applicantDetails: any;
  documentList: any;
  radioFlag: boolean = true;
  subscription!: Subscription;//used  for lang conv
  lang: any;
  routingData: any;
  encryptData: any;
  dataSource: any = new Array()
  displayedColumns: string[] = ['srNo', 'documentType', 'docNo', 'action']
  approvalStatus: any = new Array()
  otherDocArray: any = new Array()
  displayColumnRemark: string[] = ['sr_no','actionName', 'designationName', 'status', 'modifiedDate','remark','action'];
  pushAppDocArray: any = [];
  pushOtherDocArray: any = [];
  approvalStatusArray: any = [];
  reasonArray: any = [];
  @ViewChild('formDirective') private formDirective!: NgForm;
  appDataClonedArray:any;
  editOtherDocForm:boolean = false;
  selOtherDocIndex!:number;
  actionNameLabel!:string;
  uploadedDepDoc:any;

  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    private WebStorageService: WebStorageService,
    public encryptdecrypt: AesencryptDecryptService,
    private router:Router,private configService:ConfigService,
    private route: ActivatedRoute, public validation: ValidationService,
    private fb: FormBuilder, private spinner: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,
    private fileUplService: FileUploadService,
    private commonMethod: CommonMethodsService,
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getRouteParam();
    this.addDefaultFrm();
    this.addApprovalFrm();
  }

  getRouteParam() {
    this.route.queryParams.subscribe((queryParams: any) => {
      this.routingData = queryParams['id'];
    });
    this.encryptData = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`);
    this.getByApplicationId();
  }

  addApprovalFrm() {
    this.approvalFrm = this.fb.group({
      "applicationStatus": [''],
      "reason": [0],
      "remark": [''],
      "m_remark": ['']
    })
  }

  remarkDialogBox(obj?: any) {
    let dialoObj = {
     header:'Approval Remark',statusFlag:'vi',title: obj,
     cancelButton: this.lang == 'mr-IN' ? '' : '',
     okButton: 'Close',
     // okButton:''
    }
     this.dialog.open(GlobalDialogComponent, {
     width: '320px',
     data: dialoObj,
     disableClose: true,
     autoFocus: false
   })
  }

  getByApplicationId() {
    this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetApplication?Id=' + (this.encryptData) +'&UserId='+this.WebStorageService.getUserId()+'&lan=' + this.lang+'&LoginFlag='+this.configService.loginFlag, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.appDataClonedArray = JSON.parse(JSON.stringify(res.responseData))
          this.applicationData = res.responseData;
          this.applicantDetails = this.applicationData?.applicationModel;

          res.responseData.allApplicationApproval.map((ele: any) => {
            res.responseData.allApprovalDocument.find((item: any) => {
              ele.uploadDocTypeId == item.docTypeId ? (ele.documnetApprovalPath = item?.docPath) : ''
            })
          });

          this.applicationData?.allDocument?.filter((ele: any) => {
            if (ele.docTypeId != 1) {
              this.pushAppDocArray.push(ele)
            } else if (ele.docTypeId == 1) {// 1 is other doc
              this.pushOtherDocArray.push(ele)
            }
          });
          this.getApprovalStatus();
          this.getReason();
          this.dataSource = new MatTableDataSource(this.pushAppDocArray);
          this.otherDocArray = new MatTableDataSource(this.pushOtherDocArray);
          this.approvalStatus = new MatTableDataSource(this.applicationData?.allApplicationApproval);
        }
        else {
          this.applicationData = [];
          this.applicantDetails = [];
          this.dataSource = [];
          this.otherDocArray = [];
          this.approvalStatus = [];
        }
      }
    })
  }

  getApprovalStatus() {
    this.apiService.setHttp('GET', 'sericulture/api/DropdownService/GetApprovalStatusList?Id=' + this.applicationData?.id + '&ApplicationId=' + this.applicationData?.applicationId + '&ApprovalMasterId=' + this.applicationData?.approvalMasterId, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.approvalStatusArray = res.responseData;
        }
        else {
          this.approvalStatusArray = [];
        }
      }
    })
  }

  getReason() {
    let approvalFrmVal = this.approvalFrm.getRawValue();
    // this.uploadedDepDoc ='';
    if (approvalFrmVal.applicationStatus == 11 || approvalFrmVal.applicationStatus == 5) {
      this.apiService.setHttp('GET', 'sericulture/api/DropdownService/GetRejectReasons?ActionId=0', false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == '200') {
            this.reasonArray = res.responseData;
          }
          else {
            this.reasonArray = [];
          }
        }
      })
    } else if (approvalFrmVal.applicationStatus == 12 && this.applicationData.uploadDocTypeId !=0) {
      this.actionNameLabel = this.applicationData.actionName;
    }
  }

  reasonFildVal(){

  }
  //#region ----------------------------------------------------------applcant doc section start heare-----------------------------------//

  viewDocument(url: any) {
    window.open(url, '_blank')
  }

  viewimage(label?:string) {
    window.open(label == 'uplDepDoc' ? this.uploadedDepDoc.docPath :this.imageData, '_blank')
  }

  openGlobalDialog(obj?: any) {
    let dialoObj = {
      header: 'Info',
      title: 'Confirm',
      cancelButton: 'Cancel',
      okButton: 'Ok',
      discription: true,
    }
    const deleteDialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    deleteDialogRef.afterClosed().subscribe((result: any) => {
      obj.result = result;
      obj?.result.flag == 'Yes' ? this.updateAppStatus(obj) : '';
    })
  }

  updateAppStatus(selObj: any) {
    let obj = {
      "id": selObj?.id,
      "applicationStatus": 0,
      "reason": 0,
      "remark": selObj?.result.inputValue,
      "m_Remark": "",
      "modifiedBy": this.WebStorageService.getUserId()
    }



    this.apiService.setHttp('post', 'sericulture/api/ApprovalMaster/UpdateApprovalStatus', false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.commonMethod.snackBar(res.statusMessage, 0);
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

  //#endregion ----------------------------------------------------------applcant doc section end heare-----------------------------------//

//#region   ----------------------------------------------------------other doc section start heare-----------------------------------//
  uploadFrm !: FormGroup;
  imageData: string = '';
  @ViewChild('uplodLogo') clearImg!: any;

  addDefaultFrm() {
    this.uploadFrm = this.fb.group({
      "id": [0],
      "docNo": [''],
      "documentType": [''],
      "docPath": ['']
    })
  }

  get f() { return this.uploadFrm.controls }


  imageUplod(event: any, label:string, i?:any) {
    this.fileUplService.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.imageData = res.responseData;
          if (label == 'applicantDoc') {
            this.pushAppDocArray[i].docPath = this.imageData;
            this.deleteImage();
          } else if (label == 'Other') {
            this.pushOtherDocArray[i].docPath = this.imageData;
            this.deleteImage();
          } else if (label == 'otherDocForm') {
            this.f['docPath'].setValue(this.imageData)
          } else if (label == 'uplDepDoc' && this.applicationData.uploadDocTypeId !=0) {
            let obj = {
              "id": 0,
              "applicationId":this.applicationData.applicationId,
              "docTypeId": this.applicationData.uploadDocTypeId,
              "documentType": "",
              "docNo": "",
              "docPath": this.imageData,
              "isVerified": false
            }
            this.uploadedDepDoc = obj;
            this.deleteImage();
          }
        }
        else {
          this.clearImg.nativeElement.value = "";
          this.imageData = "";
        }
      }),
      error: (error: any) => {
        this.clearImg.nativeElement.value = "";
        this.spinner.hide();
        this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  delDepDocument(){
    this.uploadedDepDoc = '';
  }

  onSubmit() {
    let uploadFrmValue = this.uploadFrm.getRawValue();
    if (!uploadFrmValue?.documentType) {
      this.commonMethod.snackBar('Document name is  required', 1);
      return
    }else if (!uploadFrmValue?.docNo) {
      this.commonMethod.snackBar('Document number is  required', 1);
      return
    }else if (!uploadFrmValue?.docPath) {
      this.commonMethod.snackBar('Document path is  required', 1);
      return
    }
    else {

      let otherFormData = this.uploadFrm.getRawValue();
      let obj = {
        "id":0,
        "applicationId": this.applicationData.applicationId,
        "docTypeId": 1, // 1 is other doc
        "documentType": otherFormData?.documentType,
        "m_DocumentType": "",
        "docNo": otherFormData?.docNo,
        "docPath": otherFormData?.docPath,
        "isVerified": false,
        "isDeleted":false,
        "createdBy":this.WebStorageService.getUserId()
      }

      if(!this.editOtherDocForm){
        this.pushOtherDocArray.push(obj);
      }else{
        this.pushOtherDocArray[this.selOtherDocIndex] = obj;
        this.editOtherDocForm = false;
      }

      this.otherDocArray = new MatTableDataSource(this.pushOtherDocArray);
      this.resetOtherDocForm();
    }
  }

  onTabChanged(){
    this.resetOtherDocForm();
    this.editOtherDocForm = false;
  }

  resetOtherDocForm(){
    this.formDirective.resetForm();
    this.deleteImage();
  }

  deleteOtherDoc() {
    this.pushOtherDocArray[this.selOtherDocIndex].docPath ='';
    this.uploadFrm.controls['docPath'].setValue('');
  }

  deleteImage() {
    this.imageData = "";
    this.clearImg.nativeElement.value = "";
  }

  editOtherDoc(ele:any){
    this.editOtherDocForm = true;
    this.selOtherDocIndex = this.commonMethod.findIndexOfArrayObject(this.pushOtherDocArray,'id',ele.id)
    this.uploadFrm = this.fb.group({
      "id": [ele.id],
      "docNo": [ele.docNo],
      "documentType": [ele.documentType],
      "docPath": [ele.docPath]
    });
    // ele.docPath ? this.imageData = ele.docPath:'';
  }

  deleteOtherDocument(i:any){
    this.pushOtherDocArray[i].isDeleted = true;
    let array:any=[];
    this.pushOtherDocArray.find((ele:any)=>{
      if(!ele.isDeleted){
        array.push(ele)
      }
    });

    this.otherDocArray = new MatTableDataSource(array);
  }

//#endregion -----------------------------------------------------------other doc section end heare ---------------------------------//

  onSubmitApprovalDetails() {
    let approvalFrmVal = this.approvalFrm.getRawValue();
    if (!approvalFrmVal?.applicationStatus) {
      this.commonMethod.snackBar('Application status is  required', 1);
      return
    }else if ((approvalFrmVal.applicationStatus == 11 || approvalFrmVal.applicationStatus == 5) && !approvalFrmVal?.reason) {
      this.commonMethod.snackBar('Application reason is  required', 1);
      return
    }else if (this.actionNameLabel && !this.uploadedDepDoc && this.applicationData?.isEdit && approvalFrmVal.applicationStatus == 12) {
      this.commonMethod.snackBar(this.actionNameLabel  +' document is required', 1);
      return;
    }
    else {
      let newUploadedDoc:any = [];
      let mergeArray :any;
      mergeArray = [...this.pushAppDocArray, ...this.pushOtherDocArray];

      mergeArray.find((ele: any) => {
        this.appDataClonedArray?.allDocument.find((item: any) => {
          if ((item.id == ele.id && ele?.docPath != item.docPath) || ele.id == 0 || ele.isDeleted) {
            if(!newUploadedDoc.length ){
              newUploadedDoc.push(ele)
            }else{
              let checkPrevValue = newUploadedDoc.some((i:any)=> i.id == ele.id);
              checkPrevValue ==  '-1' || !checkPrevValue ?  newUploadedDoc.push(ele):'';
            }
          }
        })
      });
      this.actionNameLabel && this.uploadedDepDoc && this.applicationData?.isEdit ? newUploadedDoc.push(this.uploadedDepDoc):'';//uploaded  Department Document
      this.updateApprovalStatus(newUploadedDoc);
    }
  }

  updateApprovalStatus(array?: any) {
    
    if (array.length) {
      array.map((ele: any) => {
        ele.id = ele?.id || 0;
        ele.applicationId = ele?.applicationId || 0;
        ele.docTypeId = ele?.docTypeId ? ele?.docTypeId : 1;
        ele.docNo = ele?.docNo || '';
        ele.docname = ele?.documentType || '';
        ele.docPath = ele?.docPath || '';
        ele.createdBy = ele?.createdBy || this.WebStorageService.getUserId();
        ele.modifiedBy = ele?.id || this.WebStorageService.getUserId();
        ele.modifiedDate = new Date();
        ele.isDeleted = ele.isDeleted || false
      });
    }
    this.spinner.show();
    let data = this.approvalFrm.getRawValue();
    this.approvalFrm.controls['m_remark'].setValue(data?.remark);
    let mainData = { ...data, "id": this.applicationData?.id, "createdBy": this.WebStorageService.getUserId(),};
    array.length ? mainData.applicationDocument = array : mainData.applicationDocument = [];
    this.apiService.setHttp('post', 'sericulture/api/ApprovalMaster/UpdateApprovalStatus?lan=' + this.lang, false, mainData, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.router.navigate(['../application'], { relativeTo: this.route })
        }
        else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(error.statusCode);
      }
    })
  }

  addGeoTagging(_obj?:any){
    const dialogRef = this.dialog.open(GeoTaggingComponent,{
      width: '90%',
      height:'90%',
      data: this.applicationData?.getSiteInspectionDataModel,
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {
      res == 'Yes'? '' : '';
     });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

