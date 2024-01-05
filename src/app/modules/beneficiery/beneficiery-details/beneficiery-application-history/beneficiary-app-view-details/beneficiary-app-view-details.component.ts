import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { DashPipe } from 'src/app/core/Pipes/dash.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-beneficiary-app-view-details',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    DashPipe,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonToggleModule,
    TranslateModule,],
  templateUrl: './beneficiary-app-view-details.component.html',
  styleUrls: ['./beneficiary-app-view-details.component.scss']
})
export class BeneficiaryAppViewDetailsComponent {

  tableData: any;
  subscription!: Subscription;
  lang: string = 'English';
  getProfileData:any;
  categoryCastDetails:any;
  applicationApproveData=new Array();
  displayedColumns = ['sr_no', 'actionName', 'designationName', 'status', 'modifiedDate', 'remark','action'];
  dataSource = new Array();
  pushOtherDocArray: any = [];
  pushAppDocArray: any = [];
  landDetails= new Array();
  displayedColumnss = ['srNo', 'documentType', 'docNo', 'action'];
  displayedColumnses=['srNo', 'documentType', 'docNo', 'action'];
  displayedColumns1 = ['srNo', 'plantName', 'gutNo','gutArea','cultivatedArea','cultivatedPlantsCount'];
  plantationDetails= new Array();
  constructor
    (
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private commonMethod: CommonMethodsService,
      private errorHandler: ErrorHandlingService,
      public dialogRef: MatDialogRef<BeneficiaryAppViewDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
      public webStorage:WebStorageService
  ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getTableData();
  }


  getTableData() {
    this.spinner.show();
    this.apiService.setHttp('GET', 'sericulture/api/Beneficiery/GetApplicationForBeneficiery?Id=1&UserId=1&LoginFlag=web&lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableData = res.responseData;
          this.getProfileData=res.responseData.applicationModel;
          this.categoryCastDetails=res.responseData.categoryofBenificiaryModel[0];
          this.plantationDetails=res.responseData.plantingDetailsModel;
          res.responseData.allApplicationApproval.map((ele: any) => {            
            res.responseData.allApprovalDocument.find((item: any) => {              
              ele.uploadDocTypeId == item.docTypeId ? (ele.documnetApprovalPath = item?.docPath) : ''
            })
          });
          this.tableData?.allDocument?.filter((ele: any) => {
            if (ele.docTypeId != 1) {
              this.pushAppDocArray.push(ele)
            } else if (ele.docTypeId == 1) {// 1 is other doc
              this.pushOtherDocArray.push(ele)
            }
          });
          this.applicationApproveData=res.responseData.allApplicationApproval; 
          console.log('this.tableData',this.tableData);
                   
        } else {
          this.spinner.hide();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : '';
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status);
      },
    });
  }

  viewDocs(dockPath?:any){
    window.open(dockPath, '_blank')
  }

  viewDocument(url: any) {
    window.open(url, '_blank')
  }
}
