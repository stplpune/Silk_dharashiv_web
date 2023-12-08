
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
  bindTableDiv:any;
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
    this.route.paramMap.subscribe(params => {
      this.routingData = params.get('data');
    });
    let id = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`);
    this.applicationId = id
    this.getEstimateData();
    this.getAnotherEstimateData();
  }

  getEstimateData() {
    this.apiService.setHttp('GET', 'api/TechnicalEstimate/Insert-Technical-Estimate1?ApplicationId=2', false, false, false, 'masterUrl');
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

    this.bindTable();
  }


  bindTable() {
    this.bindTableDiv = `<div id="report3">
    <div style="text-align: center;">
        <h4 style="font-weight: 800;font-size: 1.1rem;margin-bottom: 3px;">परिशिष्ट - ३</h4>
        <h5 style="font-weight: 700;font-size: 0.95rem;margin-bottom: 3px;">रेशीम संचालनालय, नागपूर</h5>
        <h6 style="font-weight: 600;font-size: 0.85rem;margin-bottom: 3px;">मनरेगा अंतर्गत केंद्र शासनाची अधिसूचना
            दिनांक २३/०४/२०२३</h6>
        <p style="font-size: 0.75rem;margin-bottom: 5px;">महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार हमी योजने अंतर्गत
            एक एकर तुती लागवड संवर्धन व
            कोषउत्पादनासाठीखर्चाचे अंदाजपत्रक (रुपये) तक्ता क्रमांक - १</p>
    </div>
    <table style="font-size: 10pt;width: 100%;border: 1px solid #aaa;border-collapse: collapse;">
        <tbody style="text-align: center;">
            <tr style="border: 1px solid #aaa;border-collapse: collapse;">
                <th rowspan="3" style="border: 1px solid #aaa;border-collapse: collapse; width: 30px;">अ. क्र.</th>
                <th rowspan="3" style="border: 1px solid #aaa;border-collapse: collapse;">कामाचा तपशील</th>
                <th colspan="7" style="border: 1px solid #aaa;border-collapse: collapse;">पहिले वर्ष</th>
                <th colspan="6" style="border: 1px solid #aaa;border-collapse: collapse;">दुसरे वर्ष</th>
                <th colspan="6" style="border: 1px solid #aaa;border-collapse: collapse;">तिसरे वर्ष</th>
                <th colspan="6" style="border: 1px solid #aaa;border-collapse: collapse;">एकूण खर्चाचा तपशील</th>
            </tr>
            <tr style="border: 1px solid #aaa;border-collapse: collapse;">
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">एकक</th>
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मनुष्य दिवस
                </th>
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मंजुरी दर रु.
                    २७३/- प्रति
                    दिन</th>
                <th colspan="4" style="border: 1px solid #aaa;border-collapse: collapse;">मनरेगा अंतर्गत
                    खर्चाचा
                    तपशील</th>
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मनुष्य दिवस
                </th>
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">दर</th>
                <th colspan="4" style="border: 1px solid #aaa;border-collapse: collapse;">मनरेगा अंतर्गत
                    खर्चाचा
                    तपशील</th>
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मनुष्य दिवस
                </th>
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">दर</th>
                <th colspan="4" style="border: 1px solid #aaa;border-collapse: collapse;">मनरेगा अंतर्गत
                    खर्चाचा
                    तपशील</th>
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मनुष्य दिवस
                </th>
                <th rowspan="2" style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">दर</th>
                <th colspan="4" style="border: 1px solid #aaa;border-collapse: collapse;">मनरेगा अंतर्गत
                    खर्चाचा
                    तपशील</th>
            </tr>
            <tr style="border: 1px solid #aaa;border-collapse: collapse;">
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मजुरी</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">सामुग्री ख. रक्कम</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">लाभार्थी हिस्सा</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">एकूण</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मजुरी</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">सामुग्री</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">लाभार्थी हिस्सा</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">एकूण</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मजुरी</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">सामुग्री</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">लाभार्थी हिस्सा</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">एकूण</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">मजुरी</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">सामुग्री</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">लाभार्थी हिस्सा</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;width: 50px;">एकूण</th>
            </tr>
            <tr style="border: 1px solid #aaa;border-collapse: collapse;">
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">३</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">४</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">५</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">६</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">७</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">८</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">९</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१०</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">११</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१२</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१३</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१४</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१५</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१६</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१७</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१८</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">१९</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२०</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२१</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२२</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२३</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२४</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२५</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२६</th>
                <th style="border: 1px solid #aaa;border-collapse: collapse;">२७</th>
            </tr>
        </tbody>
        <tbody>
            <tr style="text-align: center;">
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align: center;">
                    <strong>अ.</strong>
                </td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align: center;">
                    <strong>मजुरी</strong>
                </td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center"></td>
            </tr>`
    for (let i = 0; i <= this.estimateArray.length; i++) {
      `<ng-container>
            <tr style="text-align: center;">
                <td style="text-align:center">{{i + 1}}</td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:left">`+ this.estimateArray[i].m_WorkDetail || '-' + `</td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center">`+ this.estimateArray[i].m_Unit || '-' + `</td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center">`+ this.estimateArray[i].m_UnitmanPower_1 || 0 + `</td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center">`+ this.estimateArray[i].m_UnitwagesRate_1 || 0 + `</td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center">`+ this.estimateArray[i].m_Unitwages_1 || 0 + `</td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center">`+ this.estimateArray[i].m_UnitaccessoriesAmount_1 || 0 + `</td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center">`+ this.estimateArray[i].m_UnitbenificiaryShares_1 || 0 + `</td>
                <td style="border: 1px solid #aaa;border-collapse: collapse;text-align:center">`+ this.estimateArray[i].m_Unittotal_1 || 0 + `</td>
              <tr/>
              `
    }
    `</tbody>
        </table>


        <table style="font-size: 10pt;width: 100%;border-collapse: collapse;margin-bottom: 1rem;margin-top: 3rem;">
            <tr style="text-align: center;">
                <td>
                    <div>--</div>
                    <div style="font-size:10pt;font-weight: 600;">वरिष्ठ तांत्रिक सहा.</div>
                    <div style="font-size:10pt;font-weight: 600;">रेशीम संचालनालय, नागपुर</div>
                </td>
                <td>
                    <div>--</div>
                    <div style="font-size:10pt;font-weight: 600;">संचालक.</div>
                    <div style="font-size:10pt;font-weight: 600;">रेशीम संचालनालय, नागपुर</div>
                </td>
                <td>
                    <div>--</div>
                    <div style="font-size:10pt;font-weight: 600;">उपसंचालक.</div>
                    <div style="font-size:10pt;font-weight: 600;">रेशीम संचालनालय, नागपुर</div>
                </td>
                <td>
                    <div>--</div>
                    <div style="font-size:10pt;font-weight: 600;">आयुक्त.</div>
                    <div style="font-size:10pt;font-weight: 600;">मनरेगा</div>
                </td>
            </tr>
        </table>

        <div>
            <input type="checkbox"  (change)="acceptTerms($event)"> 
            मला प्रधान केलेल्या अधिकाराचा वापर करुन मी महात्मा गांधी राष्ट्रीय रोजगार हमी योजना (मनरेगा) अंतर्गत रेशीम उद्योग विकासाची योजना राबविण्याकरिता शासन निर्णयात नमूद निकषानुसार येणार्‍या खर्चाच्या प्रकल्प आराखड्यास मान्यता प्रधान करत आहे.

        </div>
      
    </div>
</div>`;

    let demo: any = document.getElementById("document")
    demo.innerHTML = this.bindTableDiv;
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

  acceptTerms(event?: any) {
    this.acceptTermsValue = event.target.checked;
  }

  confirm() {
    // if (!this.acceptTermsValue) {
    //   this.commonMethod.snackBar('Please select terms and condition', 1);
    //   return
    // }
    this.generate_PDF();
  }

  generate_PDF() {
    debugger;

    let html = this.bindTableDiv;
    console.log(JSON.stringify(html));

    let obj = { htmlData:html, };
    console.log(obj)
    this.apiService.setHttp('POST', 'api/TechnicalEstimate/Generate-PDF', false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          console.log('resss', res);
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

}
