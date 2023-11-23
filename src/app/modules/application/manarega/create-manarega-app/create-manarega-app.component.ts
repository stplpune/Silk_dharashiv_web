import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { MasterService } from 'src/app/core/services/master.service';
@Component({
  selector: 'app-create-manarega-app',
  templateUrl: './create-manarega-app.component.html',
  styleUrls: ['./create-manarega-app.component.scss']
})
export class CreateManaregaAppComponent {
  manaregaFrm !: FormGroup;
  @ViewChild('uplodLogo') clearlogo!: any;
  imageResponse: string = '';
  subscription!: Subscription;//used  for lang conv
  lang: any;
  viewMsgFlag: boolean = false;//used for error msg show
  genderArray: any = [{ id: 1, name: 'Male' }, { id: 0, name: 'Female' }];
  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  grampanchayatArray = new Array();
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    public WebStorageService: WebStorageService,
    private fb: FormBuilder,
    private fileUpl: FileUploadService,
    private spinner: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
    private masterService: MasterService
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.addManaregaFrm();

  }

  addManaregaFrm() {
    this.manaregaFrm = this.fb.group({
      "id": [0],
      "farmerId": [10],
      "schemeTypeId": [1],
      "applicationNo": [1],
      "mobileNo1": [''],
      "aadharNo": [''],
      "profilePhotoPath": [''],
      "mn_DepartmentId": [''],
      "fullName": [''],
      "mobileNo2": [''],
      "birthDate": [''],
      "gender": [''],//no
      "qualificationId": [''],//no
      "stateId": [''],//no
      "districtId": [''],//no
      "talukaId": [''],//no
      "grampanchayatId": [''],//no
      "village": [''],
      "address": [''],
      "pinCode": [''],
      "mn_JobCardNo": [''],
      "categoryId": [''],//no
    })
  }

  get f() {
    return this.manaregaFrm.controls
  }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'OtherImage', 'png,jpg,jpeg', '', '', this.lang).subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.imageResponse = res.responseData;
          this.f['profilePhotoPath'].setValue(this.imageResponse)
        }
        else {
          this.clearlogo.nativeElement.value = "";
          this.imageResponse = "";
        }
      }),
      error: (error: any) => {
        this.clearlogo.nativeElement.value = "";
        this.spinner.hide();
        this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  viewimage() {
    window.open(this.imageResponse, '_blank')
  }

  deleteImage() {
    this.imageResponse = "";
    this.f['profilePhotoPath'].setValue(this.imageResponse)
    this.clearlogo.nativeElement.value = "";
  }


  onSubmit() {
    if (this.manaregaFrm.invalid) {
      return;
    }
    else {
      let obj = {
        "id": 0,
        "farmerId": 0,
        "schemeTypeId": 0,
        "applicationNo": "string",
        "profilePhotoPath": "string",
        "fullName": "string",
        "m_FullName": "string",
        "mn_DepartmentId": 0,
        "mobileNo1": "string",
        "mobileNo2": "string",
        "aadharNo": "string",
        "birthDate": "2023-11-23T05:37:36.259Z",
        "gender": 0,
        "qualificationId": 0,
        "stateId": 0,
        "districtId": 0,
        "talukaId": 0,
        "grampanchayatId": 0,
        "village": "string",
        "address": "string",
        "m_Address": "string",
        "pinCode": "string",
        "mn_JobCardNo": "string",
        "sm_VoterRegistrationNo": "string",
        "sm_IsBelowPovertyLine": true,
        "benificiaryTotalFarm": 0,
        "sm_LandTenureCategories": 0,
        "mulberryCultivatedSurveyNo": "string",
        "cultivatedFarmInHector": 0,
        "isJointAccHolder": true,
        "applicantFarmSurveyNo": "string",
        "applicantFarmArea": 0,
        "farmTypeId": 0,
        "irrigationFacilityId": 0,
        "sm_IrrigationPeriod": 0,
        "isAnyPlantedBeforeGovScheme": true,
        "plantName": "string",
        "gutNo": "string",
        "gutArea": "string",
        "plantCultivatedArea": 0,
        "noOfPlant": 0,
        "sm_YearOfPlanting": "2023-11-23T05:37:36.259Z",
        "sm_CultivatedArea": 0,
        "sm_LandSurveyNo": "string",
        "sm_ImprovedMulberryCast": 0,
        "sm_MulberryPlantingDistance": 0,
        "sm_PlantationSurveyNo": "string",
        "sm_MulberryCultivationArea": 0,
        "sm_PlantationMethod": 0,
        "sm_IsExperienceSilkIndustry": true,
        "sm_ExperienceYears": 0,
        "isSelfTraining": true,
        "candidateName": "string",
        "candidateRelationId": 0,
        "sm_IsSilkIndustrtyTrainingReceived": true,
        "sm_SilkIndustrtyTrainingDetails": "string",
        "sm_IsEngagedInSilkIndustry": true,
        "sm_IsTakenBenefitOfInternalScheme": true,
        "sm_NameOfPlan": "string",
        "sm_PlanTakenDate": "string",
        "sm_TakenPlanBenefit": "string",
        "bankId": 0,
        "bankBranchId": 0,
        "bankIFSCCode": "string",
        "bankAccountNo": "string",
        "isHonestlyProtectPlant": true,
        "isHonestLabor": true,
        "isSelfTransport": true,
        "isEligibleGettingInstallmentAmount": true,
        "isBoundByConditions": true,
        "isPayMoreThanLimitedAmt": true,
        "isSignedOnLetter": true,
        "isChangedAcceptable": true,
        "isSchemeCorrectAsPerSatbara": true,
        "isJointAccHolderTermAcceptable": true,
        "sm_IsReadyToPlantNewMulberries": true,
        "sm_IsHonestlyProtectPlant": true,
        "sm_IsRequestForYourPriorConsent": true,
        "registrationFeeReceiptPath": "string",
        "createdBy": 0,
        "flag": 0,
        "isUpdate": true,
        "appDoc": [
          {
            "id": 0,
            "applicationId": 0,
            "docTypeId": 0,
            "docNo": "string",
            "docname": "string",
            "docPath": "string",
            "createdBy": 0,
            "isDeleted": true
          }
        ],
        "categoryId": [
          0
        ]
      }
      this.apiService.setHttp('post', 'sericulture/api/Application/Insert-Update-Application?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            // this.dialogRef.close('Yes');
            // this.clearMainForm();
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

  // ---------------Dropdown bind functionality start here--------------------
  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }

  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
          //  this.data ? (this.f['stateId'].setValue(this.data?.stateId)) : '' ;  
        }
        else {
          this.stateArray = [];
        }
      })
    })
  }

  getDisrict() {
    this.districtArray = [];
    this.masterService.GetAllDistrict(1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.districtArray = res.responseData;
          // this.data ? (this.f['districtId'].setValue(this.data?.districtId || 1), this.getTaluka(flag)) : ''
        }
        else {
          this.districtArray = [];
        }
      })
    })
  }

  getTaluka() {
    this.talukaArray = [];
    this.masterService.GetAllTaluka(1, 1, 0).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.talukaArray = res.responseData;
          this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
          //  this.data  ? (this.f['talukaId'].setValue(this.data?.talId), this.getGrampanchayat()) : '';
        }
        else {
          this.talukaArray = [];
          this.talukaSubject.next(null);
        }
      })
    })
  }

  getGrampanchayat() {
    this.grampanchayatArray = [];
    let talukaId = this.manaregaFrm.getRawValue().talukaId;
    if (talukaId != 0) {
      this.masterService.GetGrampanchayat(talukaId).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.grampanchayatArray = res.responseData;
            // this.grampanchayatArray.unshift( { id: 0,textEnglish:'All Grampanchayat' ,textMarathi:'सर्व ग्रामपंचायत'});
            this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject);
            // this.data ? (this.f['grampanchayatId'].setValue(this.data?.grampanchayatId)) : '';
          }
          else {
            this.grampanchayatArray = [];
            this.gramPSubject.next(null);
          }
        })
      })
    }
  }

  clearDropdown(flag: any) {
    switch (flag) {
      case 'taluka':
        this.gramPSubject = new ReplaySubject<any>();
        this.grampanchayatArray = [];
        this.f['grampanchayatId'].setValue('');
        break;
       }
  }


}
