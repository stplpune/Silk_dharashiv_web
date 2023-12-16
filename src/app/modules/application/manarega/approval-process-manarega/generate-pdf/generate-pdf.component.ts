import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonModule } from '@angular/common';
import { DashPipe } from "../../../../../core/Pipes/dash.pipe";
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ActivatedRoute } from '@angular/router';
declare var html2pdf: any;

@Component({
  selector: 'app-generate-pdf',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, DashPipe],
  templateUrl: './generate-pdf.component.html',
  styleUrls: ['./generate-pdf.component.scss']
})
export class GeneratePdfComponent {
  @ViewChild('printDiv', { static: false }) printDiv!: ElementRef;

  tableDataArray: any;
  estimateArray = new Array();
  estimateSkillArray = new Array();
  routingData: any;
  actionID: any;
  year1Obj: any;
  year2Obj: any;
  year3Obj: any;
  totalSkillObject: any;
  totalUnSkillObject: any;
  skillYear1Obj: any;
  skillYear2Obj: any;
  skillYear3Obj: any;
  finalTotalRes: any;
  finaltotalArray = new Array();
  totalMappingArray: any;
  newDataArray: any = {
    totalSkill: [],
    totalUnskill: []
  };
  technicalUnSkillObj: any = {
    action1: 'सीमेंट पत्रे ऐवजी लोखंडी पत्रे, सीमेंट पाइप / कॉलम ऐवजी लोखंडी पाइप,आधिक मुलाच्या वस्तु तसेच सीमेंट, वाळू करिता इस्टिमेटपेक्षा जास्त खर्च शेतकरी स्वछ करू शकतील.',
    action2: 'विटा/रेती/सीमेंटच्या फळकवर योजनेचे नाव शेतकरी नाव कामाचा कोड व एकूण रक्कम व आदि रक्कम नमूद असावी.'
  }

  skillDataArray: any = {
    skillArray: [],
    unSkillArray: [],
    totalUnskill: []
  }
  totalObject: any = {
    totalData: [],
    totalDataSingally: []
  }
  skillYr1obj: any;
  skillYr2obj: any;
  skillYr3obj: any;
  acceptTermsValue!: boolean;
  bindTableDiv: any;
  id: any;
  sanctionArray:any;
  showDate=new Date();
  routeData:any;
  applicationId:any;
  constructor
    (
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private commonMethod: CommonMethodsService,
      private errorHandler: ErrorHandlingService,
      public encryptdecrypt: AesencryptDecryptService,
      private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.routeData = this.route.snapshot.queryParamMap.get('id');
    this.actionID= this.routeData.split('.')[1];
    this.applicationId=this.routeData.split('.')[0]; 
        
    this.getEstimateData();
    this.getAnotherEstimateData();
    this.getEstimateSanctionData();
  }

  getEstimateData() {
    this.apiService.setHttp('GET', 'api/TechnicalEstimate/Insert-Technical-Estimate1?ApplicationId='+this.applicationId, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.getExtractData(res);
          this.estimateArray = res.responseData2;
          this.estimateSkillArray = res.responseData3;
          this.finaltotalArray = res.responseData10;
          this.totalMappingArray = res.responseData11;
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

  getEstimateSanctionData() {
    this.apiService.setHttp('GET', 'sericulture/api/TechnicalSanctionLetter/GetTechnicalSanctionLetter?ApplicationId='+this.applicationId, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
            this.sanctionArray=res.responseData.responseData1;   
            console.log('this.sanctionArray',this.sanctionArray);
                     
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

  getExtractData(tableData: any) {
    tableData.responseData6.filter((res: any) => {
      this.estimateArray = res;
      if (res.name == 'Unskill') {
        this.newDataArray.totalUnskill.push(res);
      } else if (res.name == 'Skill') {
        this.newDataArray.totalSkill.push(res);
      }
    })

    this.newDataArray.totalSkill.filter((res: any) => {
      if (res.yearId == 1) {
        this.skillYr1obj = res;
      } else if (res.yearId == 2) {
        this.skillYr2obj = res;
      } else {
        this.skillYr3obj = res;
      }
    })

    this.newDataArray.totalUnskill.filter((res: any) => {
      if (res.yearId == 1) {
        this.year1Obj = res;
      } else if (res.yearId == 2) {
        this.year2Obj = res;
      } else {
        this.year3Obj = res;
      }
    })

    tableData.responseData8.filter((res: any) => {
      if (res.skillId == 1) {
        this.totalSkillObject = res;
      } else {
        this.totalUnSkillObject = res;
      }
    })

    tableData.responseData7.filter((res: any) => {
      if (res.yearId == 1) {
        this.skillYear1Obj = res;
      } else if (res.yearId == 2) {
        this.skillYear2Obj = res;
      } else {
        this.skillYear3Obj = res;
      }
    })

    tableData.responseData9.filter((res: any) => {
      this.finalTotalRes = res;
    })

  }

  getAnotherEstimateData() {
    this.apiService.setHttp('GET', 'api/TechnicalEstimate/Insert-Technical-Estimate2?ApplicationId='+this.applicationId, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res;
          this.getSkillData(res);
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

  getSkillData(data: any) {
    data.responseData2.filter((ev: any) => {
      if (ev.name == 'Skill') {
        this.skillDataArray.skillArray.push(ev);
      } else {
        this.skillDataArray.unSkillArray.push(ev);
      }
    })
    data.responseData3.filter((ev: any) => {
      this.skillDataArray.totalUnskill.push(ev)
    })

  }

  acceptTerms(event?: any) {
    this.acceptTermsValue = event.target.checked;
  }

  confirm() {
    if (!this.acceptTermsValue) {
      this.commonMethod.snackBar('Please select terms and condition', 1);
      return
    }
    this.generate_PDF();
  }

  generate_PDF() {
    let html = this.bindTableDiv;
    let obj = { htmlData: html, };
    this.apiService.setHttp('POST', 'api/TechnicalEstimate/Generate-PDF', false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
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

  print() {
    window.print();
  }

  download() {
    this.spinner.show();
    var element = document.getElementById('printArea');
    let fileName = this.actionID == 3 ? 'technical_estimate' : this.actionID == 4 ? 'technical_sanction' : 'administrative_approval';
    var opt = {
      margin: 0,
      filename: fileName + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      font: { size: 9 }
    };

    // New Promise-based usage:
    html2pdf()?.set(opt)?.from(element).save();

    // Old monolithic-style usage:
    html2pdf(element, opt);
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

}
