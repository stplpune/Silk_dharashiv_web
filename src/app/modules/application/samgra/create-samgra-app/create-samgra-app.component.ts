import { Component, ViewChild } from '@angular/core';
import { AddDetailsComponent } from './add-details/add-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/services/master.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CategoryDetailsComponent } from '../../manarega/category-details/category-details.component';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { MatTableDataSource } from '@angular/material/table';
import { ValidationService } from 'src/app/core/services/validation.service';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { MatStepper } from '@angular/material/stepper';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-samgra-app',
  templateUrl: './create-samgra-app.component.html',
  styleUrls: ['./create-samgra-app.component.scss']
})
export class CreateSamgraAppComponent {
  samgraForm !: FormGroup;
  landDetailsForm !: FormGroup;
  bankDetailsForm !: FormGroup;
  internalSchemes !: FormGroup;
  otherDocForm !: FormGroup;
  selfDeclarationForm !: FormGroup;
  documentUploadForm !: FormGroup;
  filterForm !: FormGroup;
  mobileNofilter = new FormControl()

  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  grampanchayatArray = new Array();
  qualificationArray = new Array();
  categoryArray = new Array();
  bankArray = new Array();
  branchArray = new Array();
  farmTypeArray = new Array();
  irrigationFacilityArray = new Array();
  checkedItems = new Array();
  irrigationPeriodArray = new Array();
  mulberryCastArray = new Array();
  mulberryAreaArray = new Array();
  pantationMethodArray = new Array();
  landTenureCatArray = new Array();
  internalSchemesArray = new Array();
  currentCropDetailsArray = new Array;
  lang: any;
  todayDate = new Date();
  subscription!: Subscription;
  dataSource: any;
  dataSource1: any;
  dataSource2: any;
  genderArray: any = [{ id: 1, name: 'Male', m_name: 'पुरुष' }, { id: 2, name: 'Female', m_name: 'स्त्री' }];
  checkedArray: any = [{ id: true, name: 'Yes', m_name: 'होय' }, { id: false, name: 'No', m_name: 'नाही' }];

  showOtherDoc: boolean = false;
  currentRecordId: number = 0;

  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();

  displayedColumns: string[] = ['srno', 'cropId', 'area', 'totalProduction', 'averageRate', 'totalProductionAmt', 'totalExpenses', 'netIncome', 'acreNetIncome', 'action'];
  displayedColumns1: string[] = ['srno', 'internalSchemeName', 'schemeTakenDate', 'totalBenefitTaken', 'action'];
  displayedColumns2: string[] = ['srno', 'docname', 'docNo', 'action'];
  displayedColumns4: string[] = ['srno', 'cropId', 'area', 'totalProduction', 'averageRate', 'totalProductionAmt', 'totalExpenses', 'netIncome', 'acreNetIncome'];
  displayedColumns5: string[] = ['srno', 'internalSchemeName', 'schemeTakenDate', 'totalBenefitTaken'];

  docUploadedPath: string = '';
  docArray = [{ id: 0, docTypeId: 16, docPath: '', docNo: '', docname: '', isDeleted: false }, { id: 0, docTypeId: 18, docPath: '', docNo: '', docname: '', isDeleted: false }, { id: 0, docTypeId: 19, docPath: '', docNo: '', docname: '', isDeleted: false }, { id: 0, docTypeId: 21, docPath: '', docNo: '', docname: '', isDeleted: false }, { id: 0, docTypeId: 11, docPath: '', docNo: '', docname: '', isDeleted: false }, { id: 0, docTypeId: 25, docPath: '', docNo: '', docname: '', isDeleted: false }, { id: 0, docTypeId: 14, docPath: '', docNo: '', docname: '', isDeleted: false }, { id: 0, docTypeId: 8, docPath: '', docNo: '', docname: '', isDeleted: false }, { id: 0, docTypeId: 17, docPath: '', docNo: '', docname: '', isDeleted: false }]
  otherDocArray = new Array();
  uploadedDocUrl: any;
  profileImageUrl: any;
  showotherDoc = new Array();

  showDocValidation: boolean = false;
  InternalSchemesEditFlag: boolean = false;
  InternalSchemesIndex !: number
  previewData: any;
  EditFlag: boolean = false;
  checkOtherDocumentFlag: boolean = false;
  isLinear = false;
  checkinternalSchemesflag: boolean = false;
  viewMsgFlag: boolean = false;
  samgraId:any;
  registionFeeUrl: string = "";
  applicationId: any;
  submitDate: any;
  checkApplicationId : number = 0
  @ViewChild('stepper') private myStepper!: MatStepper;
  @ViewChild('samgraDirective') private samgraDirective: NgForm | any;
  @ViewChild('landDetailsDirective') private landDetailsDirective: NgForm | any;
  @ViewChild('bankDetailsDirective') private bankDetailsDirective: NgForm | any;
  @ViewChild('selfDeclarationDirective') private selfDeclarationDirective: NgForm | any;
  @ViewChild('ScheemDirective') private ScheemDirective: NgForm | any;
  @ViewChild('DocumentDirective') private DocumentDirective: NgForm | any;

  constructor(public dialog: MatDialog,
    private masterService: MasterService,
    private commonMethod: CommonMethodsService,
    private apiService: ApiService,
    public WebStorageService: WebStorageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,
    private uploadService: FileUploadService,
    public validation: ValidationService,
    public encryptdecrypt: AesencryptDecryptService,
    private activatedRoute: ActivatedRoute,
    private dateAdapter: DateAdapter<Date>,
    private router: Router,
    private datePipe:DatePipe
  ) {
    this.dateAdapter.setLocale('en-GB');
    let Id: any;

    this.activatedRoute.queryParams.subscribe((queryParams: any) => { Id = queryParams['id'] });
    if(Id){
      this.samgraId =  this.encryptdecrypt.decrypt(`${decodeURIComponent(Id)}`)

      // this.samgraId = value.split('.');
    }
  }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })

    this.searchDataZone();
    this.samgraformData();
    this.landDetailsFormData();
    this.bankDetailsFormData();
    this.internalSchemesFormData();
    this.otherDocumentFormData();
    this.selfDeclarationFormData();
    this.filterFormData();
    this.checkScheemApplication();
    this.commonDropdown();
  }

  commonDropdown() {
    this.getQualification();
    this.getState();
    this.getFarmType();
    this.getIrrigationFacility();
    this.getBank();
    this.getCategory();
    this.getLandTenureCategories();
    this.getIrrigationPeriod();
    this.getImprovedMulberryCast();
    this.getPlantationMethod();
    this.getMulberryCultivationArea();
    this.getPreviewData();
    let photoValidation = ['profilePhotoPath']
    !this.profileImageUrl ? (this.setValidation(photoValidation, this.f)) : this.clearValidation(photoValidation, this.f)
  }
  get f() { return this.samgraForm.controls }
  get fL() { return this.landDetailsForm.controls }
  get bL() { return this.bankDetailsForm.controls }
  get fIS() { return this.internalSchemes.controls }
  get fdp() { return this.otherDocForm.controls }
  get fSD() { return this.selfDeclarationForm.controls }

  samgraformData(data?: any) {
    this.samgraForm = this.fb.group({
      "fullName": [data?.fullName || '', [Validators.required, this.validation.maxLengthValidator(100)]],
      "m_FullName":[data?.m_FullName|| '',[Validators.required, Validators.pattern(this.validation.marathi), this.validation.maxLengthValidator(100)]],
      "mobileNo1": [this.WebStorageService.getMobileNo() || '', [Validators.required, this.validation.maxLengthValidator(10), Validators.pattern(this.validation.mobile_No)]],
      "mobileNo2": [data?.mobileNo2 || '', [this.validation.maxLengthValidator(10), Validators.pattern(this.validation.mobile_No)]],
      "aadharNo": [this.samgraId ?this.samgraId :data?.aadharNo ? data?.aadharNo :'', [Validators.required, this.validation.maxLengthValidator(12), Validators.pattern(this.validation.aadhar_card)]],
      "birthDate": [data?.birthDate || '', [Validators.required]],
      "gender": [data?.genderId || 1],
      "qualificationId": [data?.qualificationId || '', [Validators.required]],
      "stateId": [this.WebStorageService.getStateId() == '' ? '' : this.WebStorageService.getStateId()],
      "districtId": [this.WebStorageService.getDistrictId() == '' ? '' : this.WebStorageService.getDistrictId()],
      "talukaId": [this.WebStorageService.getTalukaId() == '' ? '' : this.WebStorageService.getTalukaId(), [Validators.required]],
      "grampanchayatId": [this.WebStorageService.getGrampanchayatId() == '' ? '' : this.WebStorageService.getGrampanchayatId(), [Validators.required]],
      "village": [data?.village || '', [this.validation.maxLengthValidator(30), Validators.pattern(this.validation.fullName)]],
      "pinCode": [data?.pinCode || '', [Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.valPinCode)]],//numeric
      "sm_VoterRegistrationNo": [data?.sm_VoterRegistrationNo || '', this.validation.maxLengthValidator(50)],
      "address": [data?.address || '', [Validators.required, this.validation.maxLengthValidator(200)]],
      "sm_IsBelowPovertyLine": [data?.sm_IsBelowPovertyLine || false],
      "profilePhotoPath": ['']
    })
  }

  landDetailsFormData(data?: any) {
    this.landDetailsForm = this.fb.group({
      "benificiaryTotalFarm": [data?.benificiaryTotalFarm || '', [Validators.required, this.validation.maxLengthValidator(4), Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]],
      "sm_LandTenureCategories": [data?.sm_LandTenureCategories || '', [Validators.required]],
      "farmTypeId": [data?.farmTypeId || '', [Validators.required]],
      "irrigationFacilityId": [data?.irrigationFacilityId || '', [Validators.required]],
      "sm_IrrigationPeriod": [data?.sm_IrrigationPeriod || '', [Validators.required]],
      "isAnyPlantedBeforeGovScheme": [data?.isAnyPlantedBeforeGovScheme || false],
      "sm_YearOfPlanting": [data?.sm_YearOfPlanting || ''],
      "sm_CultivatedArea": [data?.sm_CultivatedArea || ''],
      "sm_LandSurveyNo": [data?.sm_LandSurveyNo || ''],
      "sm_ImprovedMulberryCast": [data?.sm_ImprovedMulberryCast || '', [Validators.required]],
      "sm_MulberryPlantingDistance": [data?.sm_MulberryPlantingDistance || '', [Validators.required, this.validation.maxLengthValidator(4), Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]],
      "sm_PlantationSurveyNo": [data?.sm_PlantationSurveyNo || '', [Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.onlyNumbers)]],
      "sm_MulberryCultivationArea": [data?.sm_MulberryCultivationArea || '', [Validators.required]],
      "sm_PlantationMethod": [data?.sm_PlantationMethod || '', [Validators.required]],
      "sm_IsExperienceSilkIndustry": [data?.sm_IsExperienceSilkIndustry || false],
      "sm_ExperienceYears": [data?.sm_ExperienceYears || ''], //show hide on radio button
      "sm_IsSilkIndustrtyTrainingReceived": [data?.sm_IsSilkIndustrtyTrainingReceived || false],
      "sm_SilkIndustrtyTrainingDetails": [data?.sm_SilkIndustrtyTrainingDetails || ''],
      "sm_IsTakenBenefitOfInternalScheme": [data?.sm_IsTakenBenefitOfInternalScheme || false],
      "sm_IsEngagedInSilkIndustry": [data?.id > 0 ? data?.sm_IsEngagedInSilkIndustry : true  ],
    })
  }

  bankDetailsFormData(data?: any) {
    this.bankDetailsForm = this.fb.group({
      "bankId": [data?.bankId || '', [Validators.required]],
      "bankBranchId": [data?.bankBranchId || '', [Validators.required]],
      "bankIFSCCode": [data?.bankIFSCCode || '', [Validators.required, this.validation.maxLengthValidator(30), Validators.pattern(this.validation.bankIFSCCodeVal)]],
      "bankAccountNo": [data?.bankAccountNo || '', [Validators.required, this.validation.maxLengthValidator(30), Validators.pattern(this.validation.onlyNumbers)]],
      "isLoanApplicable": [data?.isLoanApplicable || false],
    })
  }

  internalSchemesFormData(data?: any) {
    this.internalSchemes = this.fb.group({
      "id": [data?.id || 0],
      "applicationId": [data?.applicationId || 0],
      "internalSchemeName": ['' || data?.internalSchemeName],
      "schemeTakenDate": ['' || data?.schemeTakenDate],
      "totalBenefitTaken": ['' || data?.totalBenefitTaken],
      "createdBy": 0,
      "isDeleted": false
    })
  }
  otherDocumentFormData() {
    this.otherDocForm = this.fb.group({
      checkDocument: [''],
      docname: [''],
      docNo: [''],
      checkOtherDocumentTable: ['']
    })
  }

  selfDeclarationFormData(data?: any) {
    this.selfDeclarationForm = this.fb.group({
      sm_IsReadyToPlantNewMulberries: [data?.sm_IsReadyToPlantNewMulberries || '', Validators.required],
      sm_IsHonestlyProtectPlan: [data?.sm_IsHonestlyProtectPlant || '', Validators.required],
      sm_IsRequestForYourPriorConsent: [data?.sm_IsRequestForYourPriorConsent || '', Validators.required]
    })
  }

  filterFormData() {
    this.filterForm = this.fb.group({
      filterMobileNo: ['', [this.validation.maxLengthValidator(10), Validators.minLength(10)]],
      filterAddharNo: ['', [this.validation.maxLengthValidator(12), Validators.minLength(12)]]
    })
  }

  checkScheemApplication(){
    this.masterService.GetSelectSchemeData(this.WebStorageService.getMobileNo(),2).subscribe({
      next:((res:any)=>{
        res.statusCode == "200" ? this.checkApplicationId = res.responseData : this.checkApplicationId = 0;

      })
    })
  }

  //#region ------------------------------------------------- dropdown_start-------------------------------------------------------
  getQualification() {
    this.qualificationArray = [];
    this.masterService.GetQualification().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.qualificationArray = res.responseData : this.qualificationArray = [];
      })
    })
  }

  getState() {
    this.stateArray = [];
    this.masterService.GetAllState().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? (this.stateArray = res.responseData, this.getDisrict()) : this.stateArray = [];
      })
    })
  }

  getDisrict() {
    this.districtArray = [];
    let stateId = this.samgraForm.getRawValue()?.stateId;
    if (stateId != 0) {
      this.masterService.GetAllDistrict(1).subscribe({
        next: ((res: any) => {
          res.statusCode == "200" && res.responseData?.length ? this.districtArray = res.responseData : this.districtArray = [];
          !this.EditFlag ? this.getTaluka() : '';
        })
      })
    }
  }

  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, 'textEnglish', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, 'textEnglish', this.gramPSubject) });
  }

  getTaluka() {
    this.talukaArray = [];
    let stateId = this.samgraForm.getRawValue()?.stateId;
    let disId = this.samgraForm.getRawValue()?.districtId;
    if (disId != 0) {
      this.masterService.GetAllTaluka(stateId, disId, 0).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.talukaArray = res.responseData;
            this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, 'textEnglish', this.talukaSubject);
            this.EditFlag ? (this.f['talukaId'].setValue(this.previewData.talukaId), this.getGrampanchayat()) : this.getGrampanchayat();
          }
          else {
            this.talukaArray = [];
            this.talukaSubject.next(null);
          }
        })
      })
    }
  }

  getGrampanchayat(flag?: any) {
    (flag == 'gramp' && this.EditFlag) ? (this.f['grampanchayatId'].setValue(''), this.previewData.grampanchayatId = '') : flag == 'gramp' ? this.f['grampanchayatId'].setValue('') : ''
    this.grampanchayatArray = [];
    let talukaId = this.samgraForm.getRawValue()?.talukaId;
    this.masterService.GetGrampanchayat(talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.grampanchayatArray = res.responseData;
          this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, 'textEnglish', this.gramPSubject);
          this.EditFlag ? (this.f['grampanchayatId'].setValue(this.previewData.grampanchayatId)) : '';
        }
        else {
          this.grampanchayatArray = [];
        }
      })
    })
  }

  getCategory() {
    this.apiService.setHttp('GET', 'sericulture/api/DropdownService/Get-Category-Of-Beneficiary?lan=' + this.lang, false, false, false, 'masterUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == "200") {
          this.categoryArray = res.responseData.filter((ele: any) => { return ele.isRadioButton == 1 })
        }
        else {
          this.categoryArray = [];
        }
      }
    })
  }

  getLandTenureCategories() {
    this.masterService.getLandTenureCategories().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.landTenureCatArray = res.responseData : this.landTenureCatArray = [];
      })
    })
  }
  getFarmType() {
    this.masterService.GetFarmType().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.farmTypeArray = res.responseData : this.farmTypeArray = [];
      })
    })
  }
  getIrrigationPeriod() {
    this.masterService.getIrrigationPeriod().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.irrigationPeriodArray = res.responseData : this.irrigationPeriodArray = [];
      })
    })
  }
  getIrrigationFacility() {
    this.irrigationFacilityArray = [];
    this.masterService.GetIrrigationFacility().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.irrigationFacilityArray = res.responseData : this.irrigationFacilityArray = []
      })
    })
  }
  getImprovedMulberryCast() {
    this.irrigationFacilityArray = [];
    this.masterService.getImprovedMulberryCast().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.mulberryCastArray = res.responseData : this.mulberryCastArray = [];
      })
    })
  }
  getPlantationMethod() {
    this.irrigationFacilityArray = [];
    this.masterService.getPlantationMethod().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.pantationMethodArray = res.responseData : this.pantationMethodArray = [];
      })
    })
  }
  getMulberryCultivationArea() {
    this.irrigationFacilityArray = [];
    this.masterService.getMulberryCultivationArea().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.mulberryAreaArray = res.responseData : this.mulberryAreaArray = [];
      })
    })
  }
  getBank() {
    this.bankArray = [];
    this.masterService.GetBank().subscribe({
      next: ((res: any) => {
        res.statusCode == "200" && res.responseData?.length ? this.bankArray = res.responseData : this.bankArray = [];
      })
    })
  }
  getBankBranch(flag?: any) {
    (flag == 'branch' && this.EditFlag) ? (this.bL['bankBranchId'].setValue(''), this.previewData.grampanchayatId = '') : flag == 'branch' ? this.bL['bankBranchId'].setValue('') : ''
    this.branchArray = [];
    let bankId = this.bankDetailsForm.value.bankId;
    if (bankId != 0) {
      this.masterService.GetBankBranch(bankId).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.branchArray = res.responseData;
            this.EditFlag ? this.bL['bankBranchId'].setValue(this.previewData.bankBranchId) : '';
          }
          else {
            this.branchArray = [];
          }
        })
      })
    }
  }
  //#endregion------------------------------------------------- dropdown_End-------------------------------------------------------
  //#region -------------------------------------------------page submit method start heare--------------------------------------------------
  checkStepCon(stepper: MatStepper, flag: string) {
    let landDetailsFormValue = this.landDetailsForm.getRawValue();
    if (flag == 'samgraForm' && this.samgraForm.invalid) {
      !this.samgraForm.getRawValue().profilePhotoPaththis ? this.viewMsgFlag = true : this.viewMsgFlag = false;
      return
    } else if (flag == 'samgraForm' && this.samgraForm.valid) {
      if (!this.checkedItems.length) {
        this.lang == 'en' ? this.commonMethod.snackBar("Please select category", 1) : this.commonMethod.snackBar("कृपया श्रेणी निवडा", 1)
        return
      } else {
        this.onSubmit(flag, stepper)
      }
    } else if (this.landDetailsForm.invalid && flag == 'landDetailsForm') {
      this.viewMsgFlag = true
      return;
    } else if (this.landDetailsForm.valid && flag == 'landDetailsForm') {
      this.viewMsgFlag = true
      if (!this.currentCropDetailsArray.length) {
        this.lang == 'en' ? this.commonMethod.snackBar("Please add current crop and production details", 1) : this.commonMethod.snackBar("कृपया वर्तमान पीक आणि उत्पादन तपशील जोडा", 1)
        return
      } else if (landDetailsFormValue.sm_IsTakenBenefitOfInternalScheme == true && !this.internalSchemesArray.length) {
        this.lang == 'en' ? this.commonMethod.snackBar("Please add internal scheme details", 1) : this.commonMethod.snackBar("कृपया अंतर्गत योजना तपशील जोडा", 1)
        return
      }
      this.onSubmit(flag, stepper);
    } else if (this.bankDetailsForm.valid && flag == 'bankDetailsForm') {
      this.onSubmit(flag, stepper)
    } else if (flag == 'document') {
      if (!this.docArray[0].docPath || !this.docArray[1].docPath || !this.docArray[2].docPath) {
        let setValArray = ['checkDocument']
        this.setValidation(setValArray, this.fdp);
        return
      } else {
        this.onSubmit(flag, stepper);
      }
    } else if (this.selfDeclarationForm.invalid && flag == 'selfDeclaration') {
      this.lang == 'en' ? this.commonMethod.snackBar("Please accept all", 1) : this.commonMethod.snackBar("कृपया सर्व स्वीकारा", 1);
    } else if (this.selfDeclarationForm.valid && flag == 'selfDeclaration') {
      this.onSubmit(flag, stepper);
    } else if (flag == 'addCurrency' && !this.docArray[7]?.docPath) {
      this.lang == 'en' ? this.commonMethod.snackBar("please upload registration fee Rs.500 receipt", 1) : this.commonMethod.snackBar("कृपया नोंदणी शुल्क रु. 500 पावती अपलोड करा", 1);
      return
    } else if (flag == 'addCurrency' && this.docArray[7]?.docPath) {
      this.onSubmit(flag, stepper);
    }
  }

  onSubmit(flag: any, stepper?: any) {
    let samgraFormValue = this.samgraForm.getRawValue();
    let landDetailsFormValue = this.landDetailsForm.getRawValue();
    let bankDetailsFormValue = this.bankDetailsForm.getRawValue();
    let selfDeclarationFormValue = this.selfDeclarationForm.getRawValue();
    !landDetailsFormValue.benificiaryTotalFarm ? landDetailsFormValue.benificiaryTotalFarm = 0 : '';
    !landDetailsFormValue.farmTypeId ? landDetailsFormValue.farmTypeId = 0 : '';
    !landDetailsFormValue.irrigationFacilityId ? landDetailsFormValue.irrigationFacilityId = 0 : '';
    !landDetailsFormValue.sm_MulberryPlantingDistance ? landDetailsFormValue.sm_MulberryPlantingDistance = 0 : '';
    !landDetailsFormValue.sm_YearOfPlanting ? landDetailsFormValue.sm_YearOfPlanting = null : '';
    !landDetailsFormValue.sm_CultivatedArea ? landDetailsFormValue.sm_CultivatedArea = 0 : '';
    !landDetailsFormValue.sm_ImprovedMulberryCast ? landDetailsFormValue.sm_ImprovedMulberryCast = 0 : '';
    !landDetailsFormValue.sm_IrrigationPeriod ? landDetailsFormValue.sm_IrrigationPeriod = 0 : '';
    !landDetailsFormValue.sm_MulberryCultivationArea ? landDetailsFormValue.sm_MulberryCultivationArea = 0 : '';
    !landDetailsFormValue.sm_PlantationMethod ? landDetailsFormValue.sm_PlantationMethod = 0 : '';
    !landDetailsFormValue.sm_LandTenureCategories ? landDetailsFormValue.sm_LandTenureCategories = 0 : '';
    !landDetailsFormValue.sm_ExperienceYears ? landDetailsFormValue.sm_ExperienceYears = 0 : '';
    !bankDetailsFormValue.bankId ? bankDetailsFormValue.bankId = 0 : '';
    !bankDetailsFormValue.bankBranchId ? bankDetailsFormValue.bankBranchId = 0 : '';

    let formDocuments = this.docArray.concat(this.otherDocArray);
    this.showDocValidation = true;
    formDocuments.map((res: any) => {
      res.applicationId = this.previewData?.id || this.currentRecordId || 0
      res.createdBy = 0
    })
    let documets = formDocuments.filter((res: any) => { return res.docPath })
    let obj = {
      ...samgraFormValue,
      ...landDetailsFormValue,
      ...bankDetailsFormValue,
      "id": this.EditFlag ? this.previewData.id : this.currentRecordId,
      "farmerId": this.WebStorageService.getUserId(),
      "schemeTypeId": 2,
      "applicationNo": "",
      "profilePhotoPath": this.profileImageUrl || '',
      // "m_FullName": "",
      "applicationFrom": "",
      "mn_DepartmentId": 3,
      "isAgreeReadableInfo": true,
      "m_Address": "",
      "mn_JobCardNo": "",
      "mulberryCultivatedSurveyNo": "",
      "cultivatedFarmInHector": 0,
      "isJointAccHolder": true,
      "applicantFarmSurveyNo": "",
      "applicantFarmArea": 0,
      "plantName": "",
      "gutNo": "",
      "gutArea": "",
      "plantCultivatedArea": 0,
      "noOfPlant": 0,
      "isSelfTraining": true,
      "candidateName": "",
      "candidateRelationId": 0,
      "sm_NameOfPlan": "",
      "sm_PlanTakenDate": "2023-12-05T07:26:41.936Z",
      "sm_TakenPlanBenefit": "",
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
      "sm_IsReadyToPlantNewMulberries": selfDeclarationFormValue.sm_IsReadyToPlantNewMulberries || false,
      "sm_IsHonestlyProtectPlant": selfDeclarationFormValue.sm_IsHonestlyProtectPlant || false,
      "sm_IsRequestForYourPriorConsent": selfDeclarationFormValue.sm_IsRequestForYourPriorConsent || false,
      "registrationFeeReceiptPath": '',
      "createdBy": this.WebStorageService.getUserId(),
      // "flag": (flag == 'samgraForm' && !this.EditFlag) ? 0 : (flag == 'samgraForm' && this.EditFlag) ? 1 : flag == 'landDetailsForm' ? 2 : flag == 'bankDetailsForm' ? 3 : flag == 'document' ? 4 : flag == 'selfDeclaration' ? 5 : flag == 'addCurrency' ? 7 : '',
      "flag": (flag == 'samgraForm' &&  this.currentRecordId == 0) ? 0 : (flag == 'samgraForm' && this.currentRecordId !=0) ? 1 : flag == 'landDetailsForm' ? 2 : flag == 'bankDetailsForm' ? 3 : flag == 'document' ? 4 : flag == 'selfDeclaration' ? 5 : flag == 'addCurrency' ? 7 : '',
      "isUpdate": true,
      "appDoc": documets,
      "categoryId": this.checkedItems.map((x: any) => { return x.id }),
      "plantingDetails": [],
      "currentProducts": this.currentCropDetailsArray,
      "internalSchemes": this.internalSchemesArray
    }

    this.apiService.setHttp('post', 'sericulture/api/Application/Insert-Update-Application?lan=' + this.lang, false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.goForward(stepper)
          this.currentRecordId = res.responseData;;
          this.viewMsgFlag = false;
          flag == 'selfDeclaration' ? this.getPreviewData() : '';
          res.responseData && flag == 'addCurrency' ? this.openDialog(res) : '';
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(error.statusCode);
      }
    });
    // }
  }

  //#endregion-------------------------------------------page submit method start heare-------------------------------------------

  adddetails(obj?: any, index?: any) {
    const dialogRef = this.dialog.open(AddDetailsComponent, {
      width: '60%',
      data: obj,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'close') {
        return;
      } else {
        let existedRecord = this.currentCropDetailsArray.find((res: any) => (res.cropId == result.cropId));
        if (existedRecord && !obj) {
          existedRecord.id != 0 && existedRecord.isDeleted ? (existedRecord.isDeleted = false,this.lang == 'en' ? this.commonMethod.snackBar("Add successfully", 0) : this.commonMethod.snackBar("यशस्वीरित्या समावेष  केले", 0)) : this.lang == 'en' ? this.commonMethod.snackBar("This crop already exist", 1) : this.commonMethod.snackBar("हे पीक आधीच अस्तित्वात आहे", 1)
        } else {
          let formvalue = result
          formvalue.applicationId = this.previewData?.id || this.currentRecordId || 0;

          obj ? (this.currentCropDetailsArray[index] = result,  this.lang == 'en' ? this.commonMethod.snackBar("Update successfully", 0) : this.commonMethod.snackBar("यशस्वीरित्या अपडेट केले", 0)) : (this.currentCropDetailsArray.push(result), this.lang == 'en' ? this.commonMethod.snackBar("Add successfully", 0) : this.commonMethod.snackBar("यशस्वीरित्या समावेष  केले", 0));
        }
        this.bindcurrentCropTable();
      }
    });
  }

  categoryDialogBox() {
    const dialogRef = this.dialog.open(CategoryDetailsComponent, {
      width: '400px',
      data: this.categoryArray,
      disableClose: true,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 'true') {
        return;
      } else if (result) {
        this.categoryArray = result;
        this.checkedItems = this.categoryArray.filter(item => item.checked);
      }
    });
  }

  clearValueRadioButton(flag?: any) {
    if (flag == 'ExperienceYears') {
      this.fL['sm_ExperienceYears'].setValue('');
    } else if (flag == 'SilkIndustrtyTrainingDetails') {
      this.fL['sm_SilkIndustrtyTrainingDetails'].setValue('')
    } else if (flag == 'isBenefit' && !this.landDetailsForm.getRawValue().sm_IsTakenBenefitOfInternalScheme) {
      this.fIS['internalSchemeName'].setValue('')
      this.fIS['schemeTakenDate'].setValue('')
      this.fIS['totalBenefitTaken'].setValue('')
      this.internalSchemesArray = [];
      this.dataSource1 = new MatTableDataSource(this.internalSchemesArray);
    } else if (flag == 'AnyPlantedBefor') {
      this.fL['sm_YearOfPlanting'].setValue('');
      this.fL['sm_CultivatedArea'].setValue('');
      this.fL['sm_LandSurveyNo'].setValue('');
    } else if (flag == 'otherDoc') {
      this.viewMsgFlag = false;
      this.checkOtherDocumentFlag = true;
      this.fdp['docname'].setValue('');
      this.fdp['checkOtherDocumentTable'].setValue('');
      this.otherDocArray = [];
      this.dataSource2 = new MatTableDataSource(this.otherDocArray);
    }
  }

  radioEvent(value: any, flag: any) {
    let setValArray: any = [];
    if (flag == 'isExperience') {
      if (value == true) {
        this.fL['sm_ExperienceYears'].setValidators([Validators.required, this.validation.maxLengthValidator(2), Validators.pattern(this.validation.onlyNumbers)])
      } else if (value == false) {
        this.fL['sm_ExperienceYears'].clearValidators();
        this.clearValueRadioButton('ExperienceYears') ;
      }
      this.fL['sm_ExperienceYears'].updateValueAndValidity();
    } else if (flag == 'isTraining') {
      setValArray = ['sm_SilkIndustrtyTrainingDetails']
      this.setValidation(setValArray, this.fL);
      this.clearValidation(setValArray, this.fL);
      value == true ? this.setValidation(setValArray, this.fL) : (this.clearValidation(setValArray, this.fL), this.clearValueRadioButton('SilkIndustrtyTrainingDetails'));
    } else if (flag == 'isBenefit') {
      this.clearValueRadioButton('isBenefit')
    } else if (flag == 'AnyPlantedBefor') {
      if (value == true) {
        this.fL['sm_CultivatedArea'].setValidators([Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)])
        this.fL['sm_LandSurveyNo'].setValidators([Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.onlyNumbers)])
        this.fL['sm_YearOfPlanting'].setValidators(Validators.required)
      } else if (value == false) {
        this.fL['sm_CultivatedArea'].clearValidators();
        this.fL['sm_LandSurveyNo'].clearValidators();
        this.fL['sm_YearOfPlanting'].clearValidators();
        this.clearValueRadioButton('AnyPlantedBefor');
      }
      this.fL['sm_CultivatedArea'].updateValueAndValidity();
      this.fL['sm_LandSurveyNo'].updateValueAndValidity();
      this.fL['sm_YearOfPlanting'].updateValueAndValidity();
    }
  }

  setValidation(arr: any, control: any) {
    arr.map((res: any) => {
      control[res]?.setValidators(Validators.required);
      control[res]?.updateValueAndValidity();
    })
  }
  clearValidation(arr: any, control: any) {
    arr.map((res: any) => {
      control[res]?.clearValidators();
      control[res]?.updateValueAndValidity();
    })
  }

  addInternalSchemes() {
    let fromvalue = this.internalSchemes.getRawValue();
    if (!fromvalue?.internalSchemeName && this.landDetailsForm.getRawValue().sm_IsTakenBenefitOfInternalScheme) {
      this.lang == 'en' ? this.commonMethod.snackBar("Internal scheme name is required", 1) : this.commonMethod.snackBar("अंतर्गत योजना नाव आवश्यक आहे", 1)
      return
    } else if (!fromvalue?.schemeTakenDate && this.landDetailsForm.getRawValue().sm_IsTakenBenefitOfInternalScheme) {
      this.lang == 'en' ? this.commonMethod.snackBar("Scheme taken date is required", 1) : this.commonMethod.snackBar("योजना घेतलेली तारीख आवश्यक आहे", 1)
      return
    } else if (!fromvalue?.totalBenefitTaken && this.landDetailsForm.getRawValue().sm_IsTakenBenefitOfInternalScheme) {
      this.lang == 'en' ? this.commonMethod.snackBar("Scheme taken date is required", 1) : this.commonMethod.snackBar("एकूण घेतलेला लाभ आवश्यक आहे", 1)
      return
    }
    if (this.internalSchemes.invalid) {
      return;
    } else {
      let existedRecord = this.internalSchemesArray.find((res: any) => (res.internalSchemeName == fromvalue.internalSchemeName));
      if (existedRecord) {
        existedRecord.id != 0 && existedRecord.isDeleted ? (existedRecord.isDeleted = false, this.lang == 'en' ? this.commonMethod.snackBar("Add successfully", 0) : this.commonMethod.snackBar("यशस्वीरित्या समावेष  केले", 0)) :this.lang == 'en' ? this.commonMethod.snackBar("This scheem already exist", 1) : this.commonMethod.snackBar("ही योजना आधीच अस्तित्वात आहे", 1)
      } else {
        this.InternalSchemesEditFlag ? (this.internalSchemesArray[this.InternalSchemesIndex] = fromvalue,this.lang == 'en' ? this.commonMethod.snackBar("Update successfully", 0) : this.commonMethod.snackBar("यशस्वीरित्या अपडेट केले", 0)) : (this.internalSchemesArray.push(fromvalue), this.lang == 'en' ? this.commonMethod.snackBar("Add successfully", 0) : this.commonMethod.snackBar("यशस्वीरित्या समावेष केले", 0));
      }
      this.ScheemDirective && this.ScheemDirective.resetForm();
      this.internalSchemesFormData();
      // this.dataSource1 = new MatTableDataSource(this.internalSchemesArray);
      // this.InternalSchemesEditFlag = false;
      this.bindInternalSchemeTable();
    }

  }

  onEditInternalSchemes(obj: any, i: number) {
    this.InternalSchemesEditFlag = true;
    this.InternalSchemesIndex = i;
    this.internalSchemesFormData(obj);
  }

  deleteInternalSchemes(index: any, flag?: any) {
    if (flag == 'currentCropDetails') {
      this.isDelFlagInternalSchemes(index, flag)
    } else {
      this.isDelFlagInternalSchemes(index, flag)


      // this.internalSchemesArray.splice(index, 1);
      // !this.internalSchemesArray.length ? this.checkinternalSchemesflag = false : '';
      // this.dataSource1 = new MatTableDataSource(this.internalSchemesArray);
      // this.InternalSchemesEditFlag = false;
      // this.checkInternalInternalscheme();
    }
  }

  isDelFlagInternalSchemes(index: any, flag?: any) {
    if (flag == 'currentCropDetails') {        // delete current crop product table
      let indexVal = this.currentCropDetailsArray.findIndex((ele: any) => ele.id == index.id);

      if (index.id == 0) {
        this.currentCropDetailsArray.splice(indexVal, 1)
      } else {
        this.currentCropDetailsArray[indexVal].isDeleted = true
      };
      this.bindcurrentCropTable();
    } else {
      let indexVal = this.internalSchemesArray.findIndex((ele: any) => ele.id == index.id)
      if (index.id == 0) {
        this.internalSchemesArray.splice(indexVal, 1)
      } else {
        this.internalSchemesArray[indexVal].isDeleted = true
      };
      this.bindInternalSchemeTable()
    }

  }

  bindcurrentCropTable() {
    let currentCropDetails: any = [];
    this.currentCropDetailsArray.find((ele: any) => {
      if (ele.isDeleted) {
      } else {
        currentCropDetails.push(ele);
      }
    })
    this.dataSource = new MatTableDataSource(currentCropDetails);
  }

  bindInternalSchemeTable() {
    let internalScheme: any = [];
    this.internalSchemesArray.find((ele: any) => {
      if (ele.isDeleted) {
      } else {
        internalScheme.push(ele);
      }
    })
    this.dataSource1 = new MatTableDataSource(internalScheme);
  }
  //#region  -----------------------------------------------------------doc upload section fn start heare-----------------------------------//

  fileUpload(event: any, docId?: any, flag?: any) {
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray, 'docTypeId', docId);

    this.spinner.show();
    let type = 'jpg, jpeg, png, pdf'
    this.uploadService.uploadDocuments(event, 'ApplicationDocuments', type, '', '', this.lang).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          flag == 'otherDoc' ? this.uploadedDocUrl = res.responseData : flag == 'profilePhoto' ? (this.profileImageUrl = res.responseData, this.deleteProfilePhoto()) : flag == 'registionFee' ? this.registionFeeUrl = res.responseData : (this.docArray[indexByDocId].docPath = res.responseData, this.docArray[indexByDocId].isDeleted = false, this.clearDocumentValidation());
          this.commonMethod.snackBar(res.statusMessage, 0)
        }
      },
      error: ((error: any) => {
        this.spinner.hide();
        this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      })
    });
  }

  clearDocumentValidation() {
    if (this.docArray[0].docPath && this.docArray[1].docPath && this.docArray[2].docPath) {
      let setValArray = ['checkDocument']
      this.clearValidation(setValArray, this.fdp);
    }
  }

  viewimage(obj: any) {
    window.open(obj, '_blank')
  }

  deleteDocument(docId: any) {
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray, 'docTypeId', docId);
    this.docArray[indexByDocId]['docPath'] = '';
    this.docArray[indexByDocId]['isDeleted'] = true;
    if (!this.docArray[0].docPath || !this.docArray[1].docPath || !this.docArray[2].docPath) {
      let setValArray = ['checkDocument']
      this.setValidation(setValArray, this.fdp);
    }
  }

  //#endregion  --------------------------------------------------------doc upload section fn end heare-----------------------------------//

  submitOtherDoc() {
    let formValue = this.otherDocForm.value
    if (!formValue?.docname) {
      this.lang == 'en' ? this.commonMethod.snackBar("Document name is required", 1) : this.commonMethod.snackBar("दस्तऐवजाचे नाव आवश्यक आहे", 1)
      return
    } else if (!this.uploadedDocUrl) {
      this.lang == 'en' ? this.commonMethod.snackBar("Document is required", 1) : this.commonMethod.snackBar("कागदपत्र आवश्यक आहे", 1)
      return
    }
    let obj = {
      id: 0,
      docTypeId: 7,
      docPath: this.uploadedDocUrl,
      docNo: formValue?.docNo || '',
      docname: formValue.docname,
      isDeleted: false
    }
    let existedRecord = this.otherDocArray.find((res: any) => (res.docname == formValue.docname));
    if (existedRecord) {
      existedRecord.id != 0 && existedRecord.isDeleted ? (existedRecord.isDeleted = false, this.lang == 'en' ? this.commonMethod.snackBar("Add successfully", 0) : this.commonMethod.snackBar("यशस्वीरित्या समावेष  केले", 0)) :this.lang == 'en' ? this.commonMethod.snackBar("This document already exist", 1) : this.commonMethod.snackBar("हा दस्तऐवज आधीपासून अस्तित्वात आहे", 1)
    } else {
      this.otherDocArray.push(obj);
      this.lang == 'en' ? this.commonMethod.snackBar("Add successfully", 0) : this.commonMethod.snackBar("यशस्वीरित्या समावेष  केले", 0)
    }
    this.bindOtherDocTable();
    this.checkOtherDocumentFlag = true;
    this.uploadedDocUrl = '';
    this.viewMsgFlag = false;
    this.DocumentDirective.resetForm();
    this.otherDocumentFormData();
  }

  deleteOtherDoc(index: any) {
    if (index.id == 0) {
      this.otherDocArray.splice(index, 1)
    } else {
      let indexVal = this.otherDocArray.findIndex((ele: any) => ele.id == index.id)
      this.otherDocArray[indexVal].isDeleted = true
    };
    this.bindOtherDocTable();
  }

  bindOtherDocTable() {
    let otherDoc: any = [];
    this.otherDocArray.find((ele: any) => {
      if (ele.isDeleted) {
      } else {
        otherDoc.push(ele);
      }
    })
    this.dataSource2 = new MatTableDataSource(otherDoc);
  }

  getDocumentsWithDocId() {  //preview other docment
    this.showotherDoc = this.previewData?.documents.filter((doc: any) => doc.docId == 7);
  }


  deleteProfilePhoto(flag?: any) {
    flag == 'delete' ? this.profileImageUrl = '' : ''
    let photoValidation = ['profilePhotoPath']
    !this.profileImageUrl ? this.setValidation(photoValidation, this.f) : this.clearValidation(photoValidation, this.f)
  }

  getPreviewData() {
    // let filterformvalue = this.filterForm.value;
    let samgraFormValue = this.samgraForm.getRawValue();
    let addharNo = samgraFormValue.aadharNo
    let mobileNo = this.WebStorageService.getMobileNo();
    if (this.filterForm.invalid) {
      this.clearForm();
      this.commonMethod.snackBar("Please Enter Correct Details", 1)
      return
    } else {
      // ${+this.samgraId[0] || 0} // id
      this.apiService.setHttp('get', `sericulture/api/Application/application-preview?AadharNo=${addharNo || ''}&MobileNo=${mobileNo || ''}&lan=en`, false, false, false, 'masterUrl');
      // this.apiService.setHttp('get', `sericulture/api/Application/application-preview?MobileNo=9175515598&lan=en`, false, false, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.EditFlag = true
            this.previewData = res.responseData;
            this.currentRecordId = this.previewData?.id;
            this.samgraformData(this.previewData);
            this.landDetailsFormData(this.previewData);
            this.bankDetailsFormData(this.previewData);
            this.selfDeclarationFormData(this.previewData);
            this.onEdit(this.previewData);
            this.getDocumentsWithDocId();
          }
          else {
            this.currentRecordId = 0;
            this.previewData = [];
            this.EditFlag = false;""
          }
        })
      })
    }
  }

  onEdit(data?: any) {
    this.otherDocArray = [];
    this.getBankBranch();
    this.getTaluka();
    this.checkedItems = data.categoryOfBeneficiaries
    this.currentCropDetailsArray = data.currentProducts
    this.currentCropDetailsArray.map((res: any) => {
      res['isDeleted'] = false
    })
    this.dataSource = new MatTableDataSource(this.currentCropDetailsArray);
    this.profileImageUrl = data.profilePhotoPath;
    this.registionFeeUrl = data.registrationFeeReceiptPath;
    this.internalSchemesArray = data.internalSchemes;
    this.internalSchemesArray.map((res: any) => {
      res['isDeleted'] = false
    })
    this.dataSource1 = new MatTableDataSource(this.internalSchemesArray);
    this.docArray.find((ele: any, i: any) => {
      data.documents.find((item: any) => {
        if (ele.docTypeId == item.docId) {
          this.docArray[i].id = item.id
          this.docArray[i].docPath = item.documentPath
        } else {
          if (item.docId == 7) { // 7 is other doc
            let existingValue = this.otherDocArray.find((ele: any) => ele.id == item.id)
            let obj = { id: item.id, docTypeId: 7, docPath: item.documentPath, docNo: item?.docNo || '', docname: item.documentName, isDeleted: false }
            !existingValue ? this.otherDocArray.push(obj) : '';
            this.showOtherDoc = true;
            this.checkOtherDocumentFlag = true;
          }
        }
      })
    })
    this.dataSource2 = new MatTableDataSource(this.otherDocArray);


    this.clearDocumentValidation();
    this.checkedItems.map((ele: any) => {
      ele['textEnglish'] = ele.categoryOfBeneficiary;
      ele['textMarathi'] = ele.m_CategoryOfBeneficiary;
    })
  }

  checkBockCheck(event: any, flag: any) {
    if (flag == 'PlantNewMulberries') {
      !event.checked ? this.fSD['sm_IsReadyToPlantNewMulberries'].setValue('') : '';
    } else if (flag == 'HonestlyProtectPlan') {
      !event.checked ? this.fSD['sm_IsHonestlyProtectPlan'].setValue('') : '';
    } else if (flag == 'RequestForYourPriorConsent') {
      !event.checked ? this.fSD['sm_IsRequestForYourPriorConsent'].setValue('') : '';
    }
  }

  clearForm(flag?: any) {
    flag == 'clear' ? this.filterForm.reset() : '';
    this.samgraDirective && this.samgraDirective.resetForm();
    this.landDetailsDirective && this.landDetailsDirective.resetForm();
    this.bankDetailsDirective && this.bankDetailsDirective.resetForm();
    this.selfDeclarationDirective && this.selfDeclarationDirective.resetForm();
    this.previewData = [];
    this.samgraformData();
    this.landDetailsFormData();
    this.bankDetailsFormData();
    this.internalSchemesFormData();
    this.otherDocumentFormData();
    this.selfDeclarationFormData();
    this.profileImageUrl = ''
    this.docArray.map((ele: any) => {
      ele.docPath = ''
      ele.id = 0
    })
    this.showOtherDoc = false;
    this.EditFlag = false;
    this.currentCropDetailsArray = [];
    this.internalSchemesArray = [];
    this.otherDocArray = [];
    this.checkedItems = []
    this.dataSource2 = new MatTableDataSource(this.otherDocArray);
    this.dataSource = new MatTableDataSource(this.currentCropDetailsArray);
    this.dataSource1 = new MatTableDataSource(this.internalSchemesArray);
  }

  viewPreviewDocument(docId: any) {//preview document
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.previewData?.documents, 'docId', docId);
    let obj = this.previewData?.documents[indexByDocId].documentPath;
    window.open(obj, '_blank')
  }

  openDialog(res?: any) {
    let dialoObj = {
      header: this.lang == 'mr-IN' ? 'अभिनंदन ' : 'Congratulations',
      title: this.lang == 'mr-IN' ? 'आपला अर्ज यशस्वीरीत्या सादर झाला आहे .अर्ज क्रमांक  : ' + res.responseData1 + res.responseData2 : 'Your application has been successfully submitted. Application no: ' + res.responseData1 +' '+this.datePipe.transform(res.responseData2,'dd/MM/yyyy hh:mm a'),
      cancelButton: '',
      okButton: this.lang == 'mr-IN' ? 'ओके' : 'Ok',
      headerImage: 'assets/images/check.png'
    }
    let dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })
    dialogRef.afterClosed().subscribe((result: any) => {
      result == 'Yes' ? this.router.navigate(['../application']) : '';
    });
  }

  totalStepsCount!: number;
  ngAfterViewInit() {
    this.totalStepsCount = this.myStepper._steps.length;
  }
  goBack(stepper: MatStepper) {
    stepper.previous();
  }
  goForward(stepper: MatStepper) {
    stepper.next();
  }

  checkMobileNo() {
    let formValue = this.samgraForm.getRawValue();
    if (formValue.mobileNo1 == formValue.mobileNo2) {
      this.f['mobileNo2'].setValue('');

      // this.lang == 'en' ? 'Data not available' :'डेटा उपलब्ध नाही'
      this.lang == 'en' ?this.commonMethod.snackBar("This mobile no. already exisit", 1) :this.commonMethod.snackBar("हा मोबाईल क्र. आधिपासूनच अस्तित्वात आहे", 1)


    }

  }
}


