import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { ApiService } from 'src/app/core/services/api.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidationService } from 'src/app/core/services/validation.service';
import { GlobalDialogComponent } from 'src/app/shared/global-dialog/global-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
  styleUrls: ['./approval-process.component.scss']
})
export class ApprovalProcessComponent implements OnDestroy {
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
  displayColumnRemark: string[] = ['sr_no', 'name', 'designationName', 'status', 'modifiedDate', 'remark'];
  pushAppDocArray: any = [];
  pushOtherDocArray: any = [];
  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    private WebStorageService: WebStorageService,
    public encryptdecrypt: AesencryptDecryptService,
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
  }

  getRouteParam() {
    this.route.queryParams.subscribe((queryParams: any) => {
      this.routingData = queryParams['id'];
    });
    this.encryptData = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`);
    console.log(this.encryptData);
    this.getByApplicationId();
  }


  getByApplicationId() {
    this.apiService.setHttp('GET', 'sericulture/api/ApprovalMaster/GetApplication?Id=' + (this.encryptData) + '&lan=' + this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.applicationData = res.responseData;
          this.applicantDetails = this.applicationData?.applicationModel;

          this.applicationData?.allDocument.filter((ele: any) => {
            if (ele.docTypeId != 1) {
              this.pushAppDocArray.push(ele)
            } else if (ele.docTypeId == 1) {// 1 is other doc
              this.pushOtherDocArray.push(ele)
            }
          })
          console.log(this.pushOtherDocArray);
          this.dataSource = new MatTableDataSource(this.pushAppDocArray);
          this.otherDocArray = new MatTableDataSource(this.pushOtherDocArray);
          this.approvalStatus = new MatTableDataSource(this.applicationData?.allApplicationApproval);
        }
      }
    })
  }

  //#region ----------------------------------------------------------applcant doc section start heare-----------------------------------//

  viewDocument(url: any) {
    window.open(url);
  }

  viewdetails() {
    this.dialog.open(ViewDetailsComponent, {
      width: '80%'
    })
  }

  viewimage() {
    window.open(this.imageData, '_blank')
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
    console.log(selObj);
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

  //#region  ----------------------------------------------------------other doc section start heare-----------------------------------//
  uploadFrm !: FormGroup;
  imageData: string = '';
  @ViewChild('uplodLogo') clearImg!: any;

  addDefaultFrm() {
    this.uploadFrm = this.fb.group({
      "id": [0],
      "docNo": ['', [Validators.required]],
      "documentType": ['', [this.validation.maxLengthValidator(50), Validators.pattern(this.validation.fullName),Validators.required]],
      "docPath": ['', [Validators.required]]
    })
  }

  get f() { return this.uploadFrm.controls }


  imageUplod(event: any) {
    this.spinner.show();
    this.fileUplService.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.imageData = res.responseData;
          this.f['docPath'].setValue(this.imageData)
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

  onSubmit() {
    if (this.uploadFrm.invalid) {
      return;
    }
    else {
      let otherFormData = this.uploadFrm.getRawValue();
      let obj = {
        "id": 0,
        "applicationId": this.encryptData,
        "docTypeId": 1, // 1 is other doc
        "documentType": otherFormData?.documentType,
        "m_DocumentType": "",
        "docNo":otherFormData?.docNo,
        "docPath": this.imageData,
        "isVerified": true
      }
      this.pushOtherDocArray.push(obj);
      this.otherDocArray = new MatTableDataSource(this.pushOtherDocArray);
      this.formDirective.reset();
      this.deleteImage();
    }
  }

  deleteImage() {
    this.imageData = "";
    this.clearImg.nativeElement.value = "";
  }
  //#endregion-----------------------------------------------------------other doc section end heare ---------------------------------//


  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}

