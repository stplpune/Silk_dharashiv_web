import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { MasterService } from 'src/app/core/services/master.service';
//import { CategorydetailsComponent } from '../categorydetails/categorydetails.component';
import { CategoryDetailsComponent } from '../category-details/category-details.component';
import { ValidationService } from 'src/app/core/services/validation.service';
@Component({
  selector: 'app-create-manarega-app',
  templateUrl: './create-manarega-app.component.html',
  styleUrls: ['./create-manarega-app.component.scss']
})
export class CreateManaregaAppComponent {
  manaregaFrm !: FormGroup;
  farmInfoFrm !: FormGroup;
  farmDeatailsFrm !: FormGroup;
  @ViewChild('uplodLogo') clearlogo!: any;
  imageResponse: string = '';
  subscription!: Subscription;//used  for lang conv
  lang: any;
  viewMsgFlag: boolean = false;//used for error msg show
  genderArray: any = [{ id: 1, name: 'Male' }, { id: 0, name: 'Female' }];
  displayedColumns = ['srNo','plantName','gutNo','gutArea','cultivatedArea','cultivatedPlantsCount'];
  qualificationArray = new Array();
  departmentArray = new Array();
  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  grampanchayatArray = new Array();
  categoryArray = new Array();
  irrigationFacilityArray = new Array();
  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();
  dialogFlag: boolean = false;
  demoArray: any;
  checkedItems: any[]=[]; // Define an array to store checked items
  maxDate = new Date();
  farmDetails = new Array();
  getId:any;

  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    public WebStorageService: WebStorageService,
    private fb: FormBuilder,
    private fileUpl: FileUploadService,
    private spinner: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
    public validation: ValidationService,
    private masterService: MasterService
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.addManaregaFrm();
    this.addFarmInfo();
    this.getDepartment();
    this.getQualification();
    this.getState();
    this.getCategory();
    this.searchDataZone();
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
      "stateId": [this.WebStorageService.getStateId() == '' ? 0 : this.WebStorageService.getStateId()],//no
      "districtId": [this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],//no
      "talukaId": [this.WebStorageService.getTalukaId() == '' ? 0 : this.WebStorageService.getTalukaId()],//no
      "grampanchayatId": [this.WebStorageService.getGrampanchayatId() == '' ? 0 : this.WebStorageService.getGrampanchayatId()],//no
      "village": [''],
      "address": [''],
      "pinCode": [''],
      "mn_JobCardNo": [''],
      "categoryId": [''],//no
    })
  }

  addFarmInfo(){
    this.farmInfoFrm = this.fb.group({
      "benificiaryTotalFarm":[''],
      "mulberryCultivatedSurveyNo": "string",
      "cultivatedFarmInHector": 0,
      "isJointAccHolder": true,
      "applicantFarmSurveyNo": "string",
      "applicantFarmArea": 0,
      "farmTypeId": 0,
    "irrigationFacilityId": 0,
    "isAnyPlantedBeforeGovScheme": true,
    "isSelfTraining": true,
    "candidateName": "string",
    "candidateRelationId": 0,

      "plantingDetails": [
        {
          "id": 0,
          "applicationId": 0,
          "plantName": "string",
          "gutNo": 0,
          "gutArea": 0,
          "cultivatedArea": 0,
          "cultivatedPlantsCount": 0,
          "createdBy": 0
        }
      ],
    })
  }

  get f() {
    return this.manaregaFrm.controls
  }


  getFarmInfo(){
    this.farmDeatailsFrm = this.fb.group({
      "id": [0],
      "applicationId":[0],
      "plantName": ['',[Validators.required]],
      "gutNo": ['',[Validators.required]],
      "gutArea": ['',[Validators.required]],
      "cultivatedArea":['',[Validators.required]],
      "cultivatedPlantsCount":['',[Validators.required]],
      "createdBy":[0]
    })
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
      let formData = this.manaregaFrm?.getRawValue();
      let obj ={
        "id": formData.id,
        "farmerId": formData.farmerId,
        "schemeTypeId":formData.schemeTypeId,
        "applicationNo":String(formData.applicationNo),
        "profilePhotoPath": formData.profilePhotoPath,
        "fullName": formData.fullName,
        "m_FullName": formData.fullName,//enter marathi name
        "mn_DepartmentId":formData.mn_DepartmentId,
        "mobileNo1":formData.mobileNo1,
        "mobileNo2": formData.mobileNo2,
        "aadharNo": formData.aadharNo,
        "birthDate": this.commonMethod.setDate(formData.birthDate) || null,
        "gender":formData.gender,
        "qualificationId": formData.qualificationId,
        "stateId":formData.stateId,
        "districtId":formData.districtId,
        "talukaId":formData.talukaId,
        "grampanchayatId":formData.grampanchayatId,
        "village": formData.village,
        "address": formData.address,
        "m_Address":formData.address,
        "pinCode":formData.pinCode,
        "mn_JobCardNo":formData.mn_JobCardNo,







       
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
        "sm_YearOfPlanting": "2023-11-24T09:55:29.130Z",
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
        "sm_PlanTakenDate": "2023-11-24T09:55:29.130Z",
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
        "categoryId": this.checkedItems.map((x:any)=>{return x.id}),
        "plantingDetails": [
          {
            "id": 0,
            "applicationId": 0,
            "plantName": "string",
            "gutNo": 0,
            "gutArea": 0,
            "cultivatedArea": 0,
            "cultivatedPlantsCount": 0,
            "createdBy": 0
          }
        ],
        "internalSchemes": [
          {
            "id": 0,
            "applicationId": 0,
            "internalSchemeName": "string",
            "schemeTakenDate": "2023-11-24T09:55:29.130Z",
            "totalBenefitTaken": 0,
            "createdBy": 0
          }
        ]
      }
      this.apiService.setHttp('post', 'sericulture/api/Application/Insert-Update-Application?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.getId = res.responseData;
            console.log("this.getId",this.getId)
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

  getDepartment() {
    this.departmentArray = [];
    this.masterService.GetDepartmentDropdown().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.departmentArray = res.responseData;
        }
        else {
          this.departmentArray = [];
        }
      })
    })
  }

  // GetIrrigationFacility()

  getIrrigationFacility() {
    this.irrigationFacilityArray = [];
    this.masterService.GetIrrigationFacility().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.irrigationFacilityArray = res.responseData;
        }
        else {
          this.irrigationFacilityArray = [];
        }
      })
    })
  }


  getQualification(){
    this.qualificationArray = [];
    this.masterService.GetQualification().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.qualificationArray = res.responseData;
          //  this.data ? (this.f['qualificationId'].setValue(this.data?.qualificationId)) : '' ;  
        }
        else {
          this.qualificationArray = [];
        }
      })
    })
  }

  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.stateArray = res.responseData;
          //  this.data ? (this.f['stateId'].setValue(this.data?.stateId)) : '' ;  
          this.getDisrict();
        }
        else {
          this.stateArray = [];
        }
      })
    })
  }

  getDisrict() {
    this.districtArray = [];
    let stateId = this.manaregaFrm.getRawValue()?.stateId;
    if (stateId != 0) {
      this.masterService.GetAllDistrict(1).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.districtArray = res.responseData;
            // this.data ? this.f['districtId'].setValue(this.data?.districtId) : ''
            this.getTaluka();
          }
          else {
            this.districtArray = [];
          }
        })
      })
    }
  }

  getTaluka() {
    this.talukaArray = [];
    let stateId = this.manaregaFrm.getRawValue()?.stateId;
    let disId = this.manaregaFrm.getRawValue()?.districtId;
    if (disId != 0) {
      this.masterService.GetAllTaluka(stateId, disId, 0).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.talukaArray = res.responseData;
            this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject);
            //  this.data  ? this.f['talukaId'].setValue(this.data?.talId) : '';
            this.getGrampanchayat()
          }
          else {
            this.talukaArray = [];
            this.talukaSubject.next(null);
          }
        })
      })
    }
  }

  // GetQualification()

  getGrampanchayat() {
    this.grampanchayatArray = [];
    let talukaId = this.manaregaFrm.getRawValue()?.talukaId;
    // if (talukaId != 0) {
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
    // }
  }

  getCategory() {
    this.apiService.setHttp('GET', 'sericulture/api/DropdownService/Get-Category-Of-Beneficiary?lan=' + this.lang, false, false, false, 'masterUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.categoryArray = res.responseData;
        }
        else {
          this.categoryArray = [];
        }
      }
    })
  }

  categoryDialogBox() {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      width: '400px',
      data: this.categoryArray,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.categoryArray = result;
        this.checkedItems = this.categoryArray.filter(item => item.checked);
      }
    });
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


