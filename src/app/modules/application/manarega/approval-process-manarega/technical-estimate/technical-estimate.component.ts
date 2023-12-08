
import { Component } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-technical-estimate',
  templateUrl: './technical-estimate.component.html',
  styleUrls: ['./technical-estimate.component.scss'],
  imports: [CommonModule, MatCardModule, MatButtonModule, DashPipe]
})
export class TechnicalEstimateComponent {
  tableDataArray: any;
  estimateArray = new Array();
  estimateSkillArray = new Array();
  routingData: any;
  applicationId: any;
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
    action1 : 'सीमेंट पत्रे ऐवजी लोखंडी पत्रे, सीमेंट पाइप / कॉलम ऐवजी लोखंडी पाइप,आधिक मुलाच्या वस्तु तसेच सीमेंट, वाळू करिता इस्टिमेटपेक्षा जास्त खर्च शेतकरी स्वछ करू शकतील.',
    action2 : 'विटा/रेती/सीमेंटच्या फळकवर योजनेचे नाव शेतकरी नाव कामाचा कोड व एकूण रक्कम व आदि रक्कम नमूद असावी.'
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

  constructor
    (
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private commonMethod: CommonMethodsService,
      private errorHandler: ErrorHandlingService,
      public encryptdecrypt: AesencryptDecryptService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.routingData = params.get('data');
      // if (this.routingData) {
      //   this.routingData = JSON.parse(this.routingData);
      //   console.log("  this.routingData" , this.routingData)
      // }
      
    });
    let id =this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`);
     this.applicationId = id
     this.getEstimateData();
    this.getAnotherEstimateData();
  }

  getEstimateData() {
    this.apiService.setHttp('GET', 'api/TechnicalEstimate/Insert-Technical-Estimate1?ApplicationId=2' , false, false, false, 'masterUrl');
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

  getExtractData(tableData: any) {
    tableData.responseData6.filter((res: any) => {
      this.estimateArray = res;
      if (res.name == 'Unskill') {
        this.newDataArray.totalUnskill.push(res);
      } else if (res.name == 'Skill') {
        this.newDataArray.totalSkill.push(res);
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
    this.apiService.setHttp('GET', 'api/TechnicalEstimate/Insert-Technical-Estimate2?ApplicationId=2', false, false, false, 'masterUrl');
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

  acceptTerms(event?:any) {
    if (event.target.checked === true) {
      // Handle your code
      }
  }

}
