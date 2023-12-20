import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReplaySubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/services/master.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule, TranslateModule, NgxMatSelectSearchModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  subscription!: Subscription;//used  for lang conv
  lang: any;
  dashboardData: any;
  filterFrm!: FormGroup;
  schemeFilterArr: any = [];
  districtArr: any = [];
  talukaArr: any = [];
  grampanchayatArray: any = [];
  actionArr: any = [];
  talukaCtrl: FormControl = new FormControl();
  gramPCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();
  manaregaArray: any = [];
  samgraArray: any = [];
  manaregaCount: number = 0;
  samgraCount: number = 0;

  constructor(public WebStorageService: WebStorageService, private apiService: ApiService, private router: Router, private fb: FormBuilder, private master: MasterService,
    private spinner: NgxSpinnerService, private errorHandler: ErrorHandlingService, private commonMethod: CommonMethodsService, public encryptdecrypt: AesencryptDecryptService) {

    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    });

    this.getDisrict();
    this.filterDefaultFrm();
    this.getAllScheme();
  
    this.getDashboardCount();
    this.searchDataZone();
    this.WebStorageService.getLocalstorageData();
  }


  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      schemeTypeId: [0],
      districtId: [this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],
      talukaId: [this.WebStorageService.getTalukaId() == '' ? 0 : this.WebStorageService.getTalukaId()],
      grampanchayatId: [this.WebStorageService.getGrampanchayatId() == '' ? 0 : this.WebStorageService.getGrampanchayatId()],
      statusId: [0],
      actionId: [0],
    });
  }

  clearFilter(){
    this.filterDefaultFrm();   
    this.getDashboardCount();
  }

  get f() { return this.filterFrm.controls };

  clearDropdown(dropdown: string) {
    if (dropdown == 'Taluka') {
      this.f['grampanchayatId'].setValue(0);
      this.grampanchayatArray = [];
    }
  }

  getAllScheme() {
    this.schemeFilterArr = [];
    this.master.GetAllSchemeType().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.schemeFilterArr.unshift({ id: 0, textEnglish: "All Scheme", textMarathi: "सर्व योजना" }, ...res.responseData);

        } else {
          this.schemeFilterArr = [];
        }
      },
    });
  }

  getDisrict() {
    this.districtArr = [];
    this.master.GetAllDistrict(this.WebStorageService.getStateId()).subscribe({
      next: ((res: any) => {
        this.districtArr = res.responseData;
        this.getTaluka();
      }), error: (() => {
        this.districtArr = [];
      })
    })
  }

  getTaluka() {
    this.talukaArr = [];
    let distId = this.filterFrm.getRawValue().districtId;
    this.master.GetAllTaluka(this.WebStorageService.getStateId(), distId, 0,).subscribe({
      next: ((res: any) => {
        this.talukaArr.unshift({ id: 0, textEnglish: "All Taluka", textMarathi: "सर्व तालुका" }, ...res.responseData);
        this.commonMethod.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
        this.getGrampanchayat();
      }), error: (() => {
        this.talukaArr = [];
      })
    })
  }

  getGrampanchayat() {
    this.gramPSubject = new ReplaySubject<any>();
    this.grampanchayatArray = [];
    let talukaId = this.filterFrm.getRawValue().talukaId;
    if (talukaId != 0) {
      this.master.GetGrampanchayat(talukaId || 0).subscribe({
        next: ((res: any) => {
          this.grampanchayatArray.unshift({ id: 0, textEnglish: "All Grampanchayat", textMarathi: "सर्व ग्रामपंचायत" }, ...res.responseData);
          this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
        }), error: (() => {
          this.grampanchayatArray = [];
          this.gramPSubject.next(null);
        })
      })
    }
  }

  getAction() {
    if(this.filterFrm.getRawValue().schemeTypeId == 0){
      this.filterFrm.controls['actionId'].setValue(0);
      return
    }
    this.actionArr = [];
    let obj = {
      lan:this.lang,
      SchemeId:this.filterFrm.getRawValue().schemeTypeId,
      designationId:this.WebStorageService.getDesignationId()
    }
    this.master.getActionDropDownWithObj(obj).subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.actionArr.unshift({ id: 0, textEnglish: "All Action", textMarathi: "सर्व कृती" }, ...res.responseData);
        } else {
          this.actionArr = [];
        }
      },
    });
  }


  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArr, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }


  getDashboardCount(_status?: any) {
    this.spinner.show();
    this.manaregaArray = [];
    this.samgraArray = [];
    this.manaregaCount = 0;
    this.samgraCount = 0;
    let data: any;
    let formData = this.filterFrm.getRawValue();
    this.apiService.setHttp('GET', 'sericulture/api/Action/GetOfficerDashboard?' + '&SchemeTypeId=' + (formData.schemeTypeId || 0) + '&DistrictId=' + (formData.districtId || 0) + '&TalukaId=' + (formData.talukaId || 0) + '&GrampanchayatId=' + (formData.grampanchayatId || 0) +
      '&UserId=' + (this.WebStorageService.getUserId() || 0) + '&actionId=' + (formData.actionId || 0) + '&lan=' + this.lang, false, false, false, 'masterUrl');
    '&ActionId=' + (formData.actionId || 0), false, data, false, 'masterUrl';
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.dashboardData = res;

          this.dashboardData?.responseData1.find((ele: any) => {
            if (ele.schemeTypeId == 1) { //1 is  MANAREGA
              this.manaregaCount += Number(ele.pendingCount + ele.rejectCount + ele.resendCount + ele.approvedCount)
              this.manaregaArray.push(ele);
            } else if (ele.schemeTypeId == 2) { //2 SILK SAMGRA
              this.samgraCount += Number(ele.pendingCount + ele.rejectCount + ele.resendCount + ele.approvedCount)
              this.samgraArray.push(ele)
            }
          });
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

  redToAppPage(obj: any, appStaId: any) { //'dis','tal','gram','scheme','action','app final Status'
    let formValue = this.filterFrm.getRawValue();
    let jsonStr: any = `${formValue?.districtId}` + '.' + `${formValue?.talukaId}` + '.' + `${formValue?.grampanchayatId}` + '.' + `${obj.schemeTypeId}` + '.' + `${obj?.actionId}` + '.' + `${appStaId}`;
    let data: any = this.encryptdecrypt.encrypt(jsonStr);
    this.router.navigate(['../application'], {
      queryParams: {
        id: data
      },
    })
  }

}
