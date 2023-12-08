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
// import { CommonMethodsService } from 'src/app/core/services/common-methods.service';

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
  selfDeclarationForm !: FormGroup

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
  dataSource2:any;
  genderArray: any = [{ id: 1, name: 'Male' }, { id: 0, name: 'Female' }];
  checkedArray: any = [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];

  showOtherDoc : boolean = false;
  currentRecordId : number = 0;

  talukaCtrl: FormControl = new FormControl();
  talukaSubject: ReplaySubject<any> = new ReplaySubject<any>();
  gramPCtrl: FormControl = new FormControl();
  gramPSubject: ReplaySubject<any> = new ReplaySubject<any>();


  displayedColumns: string[] = ['srno', 'cropId', 'area', 'totalProduction', 'averageRate', 'totalProductionAmt', 'totalExpenses', 'netIncome', 'acreNetIncome','action'];
  displayedColumns1: string[] = ['srno', 'internalSchemeName', 'schemeTakenDate', 'totalBenefitTaken','action'];
  displayedColumns2: string[] = ['srno', 'docname','docNo', 'action'];

  docUploadedPath: string = '';
  docArray = [{id:0,docTypeId:16,docPath:'',docNo:'',docname:''},{id:0,docTypeId:18,docPath:'',docNo:'',docname:''},{id:0,docTypeId:19,docPath:'',docNo:'',docname:''},{id:0,docTypeId:21,docPath:'',docNo:'',docname:''},{id:0,docTypeId:11,docPath:'',docNo:'',docname:''},{id:0,docTypeId:25,docPath:'',docNo:'',docname:''},{id:0,docTypeId:14,docPath:'',docNo:'',docname:''}]
  otherDocArray = new Array();
  uploadedDocUrl : any;
  profileImageUrl :any;
  
  showDocValidation : boolean = false;

  InternalSchemesEditFlag: boolean = false;
  InternalSchemesIndex !: number

  @ViewChild('ScheemDirective') private ScheemDirective: NgForm | undefined;
  @ViewChild('DocumentDirective') private DocumentDirective: NgForm | undefined;

  
  constructor(public dialog: MatDialog,
    private masterService: MasterService,
    private commonMethod: CommonMethodsService,
    private apiService: ApiService,
    public WebStorageService: WebStorageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,
    private uploadService: FileUploadService,
    public validation : ValidationService
  ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
 
    this.searchDataZone();
    this.samgraformData();
    this.landDetailsFormData();
    this.bankDetailsFormData();
    this.internalSchemesFormData();
    this.otherDocumentFormData();
    this.selfDeclarationFormData();
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
  }
  get f() {
    return this.samgraForm.controls
  }

  get fL() {
    return this.landDetailsForm.controls
  }
  get bL() {
    return this.bankDetailsForm.controls
  }

  samgraformData() {
    this.samgraForm = this.fb.group({
      "id": [this.currentRecordId],
      "fullName": ['',[Validators.required,Validators.maxLength(100)]],
      "mobileNo2": ['',[Validators.maxLength(10)]],      
      "birthDate": ['',[Validators.required]],
      "gender": [1],
      "qualificationId": [0,[Validators.required]],
      "stateId": [this.WebStorageService.getStateId() == '' ? 0 : this.WebStorageService.getStateId()],
      "districtId": [this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],
      "talukaId": [this.WebStorageService.getTalukaId() == '' ? 0 : this.WebStorageService.getTalukaId(),[Validators.required]],
      "grampanchayatId": [this.WebStorageService.getGrampanchayatId() == '' ? 0 : this.WebStorageService.getGrampanchayatId(),[Validators.required]],
      "village": ['',[Validators.required]],
      "pinCode": ['',[Validators.required,Validators.maxLength(6)]],//numeric
      "sm_VoterRegistrationNo": [''],
      "address": ['',[Validators.required]],
      "sm_IsBelowPovertyLine": true,
        // category validation remaning 
    })
  }

  landDetailsFormData() {
    this.landDetailsForm = this.fb.group({
      "benificiaryTotalFarm": ['',[Validators.required,Validators.maxLength(5)]],
      "sm_LandTenureCategories": 0,  
      "farmTypeId": ['',[Validators.required]],
      "irrigationFacilityId": ['',[Validators.required]],
      "sm_IrrigationPeriod": 0,
      "isAnyPlantedBeforeGovScheme": false,
      "sm_YearOfPlanting": [''],
      "sm_CultivatedArea": [''],
      "sm_LandSurveyNo": [''],
      "sm_MulberryPlantingDistance": [''],
      "sm_MulberryCultivationArea": [0],
      "sm_PlantationMethod": [0],
      "sm_IsExperienceSilkIndustry": false,
      "sm_ExperienceYears": [''],
      "sm_IsSilkIndustrtyTrainingReceived": false,
      "sm_SilkIndustrtyTrainingDetails": [''],
      "sm_IsTakenBenefitOfInternalScheme": false,
      "sm_IsEngagedInSilkIndustry": true,
    })
  }

  bankDetailsFormData() {
    this.bankDetailsForm = this.fb.group({
      "bankId": ['',[Validators.required]],
      "bankBranchId": ['',[Validators.required]],
      "bankIFSCCode": ['',[Validators.required,Validators.maxLength(30)]],
      "bankAccountNo": ['',[Validators.required,Validators.maxLength(30)]],
    })
  }
  get fIS(){return this.internalSchemes.controls}

  internalSchemesFormData(data?:any) {
    this.internalSchemes = this.fb.group({
      "id": [0 || data?.id],
      "applicationId": [0 || data?.applicationId],
      "internalSchemeName": ['' || data?.internalSchemeName],
      "schemeTakenDate": ['' || data?.schemeTakenDate],
      "totalBenefitTaken": ['' || data?.totalBenefitTaken],
      "createdBy": 0
    })
  }

  otherDocumentFormData(){
    this.otherDocForm = this.fb.group({
      docname:[''],
      docNo:['']
    })
  }

  selfDeclarationFormData(){
    this.selfDeclarationForm = this.fb.group({
      sm_IsReadyToPlantNewMulberries :[''],
      sm_IsHonestlyProtectPlan : [''],
      sm_IsRequestForYourPriorConsent : ['']
    })
  }


  getQualification() {
    this.qualificationArray = [];
    this.masterService.GetQualification().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.qualificationArray = res.responseData;
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
    let stateId = this.samgraForm.getRawValue()?.stateId;
    if (stateId != 0) {
      this.masterService.GetAllDistrict(1).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.districtArray = res.responseData;
            this.getTaluka();
          }
          else {
            this.districtArray = [];
          }
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

  getGrampanchayat() {
    this.grampanchayatArray = [];
    let talukaId = this.samgraForm.getRawValue()?.talukaId;
    if (talukaId != 0) {
      this.masterService.GetGrampanchayat(talukaId).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.grampanchayatArray = res.responseData;
            this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, 'textEnglish', this.gramPSubject);
          }
          else {
            this.grampanchayatArray = [];
          }
        })
      })
    }
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
        if (res.statusCode == "200" && res.responseData?.length) {
          this.landTenureCatArray = res.responseData;
        }
        else {
          this.landTenureCatArray = [];
        }
      })
    })
  }


  getFarmType() {
    this.masterService.GetFarmType().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.farmTypeArray = res.responseData;
        }
        else {
          this.farmTypeArray = [];
        }
      })
    })
  }

  getIrrigationPeriod() {
    this.masterService.getIrrigationPeriod().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.irrigationPeriodArray = res.responseData;
        }
        else {
          this.irrigationPeriodArray = [];
        }
      })
    })
  }

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

  getImprovedMulberryCast() {
    this.irrigationFacilityArray = [];
    this.masterService.getImprovedMulberryCast().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.mulberryCastArray = res.responseData;
        }
        else {
          this.mulberryCastArray = [];
        }
      })
    })
  }


  getPlantationMethod() {
    this.irrigationFacilityArray = [];
    this.masterService.getPlantationMethod().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.pantationMethodArray = res.responseData;
        }
        else {
          this.pantationMethodArray = [];
        }
      })
    })
  }

  getMulberryCultivationArea() {
    this.irrigationFacilityArray = [];
    this.masterService.getMulberryCultivationArea().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.mulberryAreaArray = res.responseData;
        }
        else {
          this.mulberryAreaArray = [];
        }
      })
    })
  }


  getBank() {
    this.bankArray = [];
    this.masterService.GetBank().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.bankArray = res.responseData;
        }
        else {
          this.bankArray = [];
        }
      })
    })
  }

  getBankBranch() {
    this.branchArray = [];
    let bankId = this.bankDetailsForm.getRawValue()?.bankId;
    if (bankId != 0) {
      this.masterService.GetBankBranch(bankId).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.branchArray = res.responseData;
          }
          else {
            this.branchArray = [];
          }
        })
      })
    }
  }

   //#region -------------------------------------------------page submit method start heare-------------------------------------------------- 
  onSubmit(flag:any) {
//internal scheem form validation remove remaning 

    let samgraFormValue = this.samgraForm.getRawValue();
    let landDetailsFormValue = this.landDetailsForm.value;
    let bankDetailsFormValue = this.bankDetailsForm.getRawValue();
    let selfDeclarationFormValue = this.selfDeclarationForm.getRawValue();

    landDetailsFormValue.benificiaryTotalFarm == '' ? landDetailsFormValue.benificiaryTotalFarm = 0:'';
    landDetailsFormValue.farmTypeId  == '' ? landDetailsFormValue.farmTypeId = 0 : '';
    landDetailsFormValue.irrigationFacilityId  == '' ? landDetailsFormValue.irrigationFacilityId = 0 : '' ;
    landDetailsFormValue.sm_MulberryPlantingDistance == '' ?landDetailsFormValue.sm_MulberryPlantingDistance = 0 : ''
    bankDetailsFormValue.bankId == '' ? bankDetailsFormValue.bankId = 0 : '';
    bankDetailsFormValue.bankBranchId == '' ? bankDetailsFormValue.bankBranchId = 0 :'';

    let formDocuments = this.docArray.concat(this.otherDocArray);
    this.showDocValidation= true;
    formDocuments.map((res:any)=>{
      res.createdBy = 0,
      res.isDeleted = true
    })    

console.log("selfDeclarationFormValue",selfDeclarationFormValue);

  
    let obj = {  
        ...samgraFormValue,
        ...landDetailsFormValue,
         ...bankDetailsFormValue,
        "farmerId": 0,
        "schemeTypeId": 0,
        "applicationNo": "string",
        "profilePhotoPath": "string",
        "m_FullName": "string",
        "mn_DepartmentId": 0,
        "mobileNo1": "string",
        "aadharNo": "string",
        "isAgreeReadableInfo": true,
        "m_Address": "string",
        "mn_JobCardNo": "string",
        "mulberryCultivatedSurveyNo": "string",
        "cultivatedFarmInHector": 0,
        "isJointAccHolder": true,
        "applicantFarmSurveyNo": "string",
        "applicantFarmArea": 0,
        "plantName": "string",
        "gutNo": "string",
        "gutArea": "string",
        "plantCultivatedArea": 0,
        "noOfPlant": 0,
        "sm_ImprovedMulberryCast": 0,
        "sm_PlantationSurveyNo": "string",
        "sm_ExperienceYears": 0,
        "isSelfTraining": true,
        "candidateName": "string",
        "candidateRelationId": 0,
        "sm_NameOfPlan": "string",
        "sm_PlanTakenDate": "2023-12-05T07:26:41.936Z",
        "sm_TakenPlanBenefit": "string",
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
        "flag":flag == 'samgraForm' ? 0 : flag == 'landDetailsForm' ? 2 : flag == 'bankDetailsForm' ? 3 : flag == 'document' ? 4 : '',
        "isUpdate": true,
        "appDoc":formDocuments,
        "categoryId": this.checkedItems.map((x:any)=>{return x.id}),
        "plantingDetails": [{
            "id": 0,
            "applicationId": 0,
            "plantName": "string",
            "gutNo": 0,
            "gutArea": 0,
            "cultivatedArea": 0,
            "cultivatedPlantsCount": 0,
            "createdBy": 0,
            "isDeleted": true
          }],
          "currentProducts":this.currentCropDetailsArray,
          "internalSchemes":this.internalSchemesArray
      
    }

    console.log("object", obj);

    // return

    this.apiService.setHttp('post', 'sericulture/api/Application/Insert-Update-Application?lan=' + this.lang, false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
           this.currentRecordId = res.responseData;
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

   //#endregion-------------------------------------------page submit method start heare-------------------------------------------

  adddetails(obj?:any,index?:any) {
    const dialogRef = this.dialog.open(AddDetailsComponent, {
      width: '50%',
      data:obj,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log("result",result);
      if(result == 'close' ){
        return;
      } else{
        let existedRecord = this.currentCropDetailsArray.find((res: any) => res.cropId == result.cropId);
        if(existedRecord && !obj){
          this.commonMethod.snackBar("this  Crop already exist", 1)
        }else{
          obj ? (this.currentCropDetailsArray[index] = result ,this.commonMethod.snackBar("Update successfully", 0)) : (this.currentCropDetailsArray.push(result), this.commonMethod.snackBar("Add successfully", 0));
        }
        this.dataSource = new MatTableDataSource(this.currentCropDetailsArray);
      } 
      // result == 'close' ? '' : obj ? this.currentCropDetailsArray[index] = result : this.currentCropDetailsArray.push(result);
      
            
     
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

  radioEvent(value:any, flag: any) {
    let setValArray: any = [];
    if (flag == 'isExperience') {
      setValArray = ['sm_ExperienceYears']
      this.setValidation(setValArray, this.fL);
      this.clearValidation(setValArray, this.fL);
      value == true ?  this.setValidation(setValArray, this.fL) : this.clearValidation(setValArray, this.fL);
    } else if (flag == 'isTraining') {
      setValArray = ['sm_SilkIndustrtyTrainingDetails']
      this.setValidation(setValArray, this.fL);
      this.clearValidation(setValArray, this.fL);
      value == true ?  this.setValidation(setValArray, this.fL) : this.clearValidation(setValArray, this.fL);
    } else if (flag == 'isBenefit') {
      setValArray = ['internalSchemeName','schemeTakenDate','totalBenefitTaken']
      this.setValidation(setValArray, this.fIS);
      this.clearValidation(setValArray, this.fIS);
      value == true ? this.setValidation(setValArray, this.fIS) :  this.clearValidation(setValArray, this.fIS);
    }else if(flag == 'AnyPlantedBefor'){
      setValArray = ['sm_YearOfPlanting','sm_CultivatedArea','sm_LandSurveyNo']
      this.setValidation(setValArray, this.fL);
      this.clearValidation(setValArray, this.fL);
      value == true ? this.fL['sm_YearOfPlanting']?.setValidators([Validators.required,Validators.maxLength(200)]) : this.fIS['sm_YearOfPlanting']?.clearValidators();
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
   let  setValArray = ['internalSchemeName','schemeTakenDate','totalBenefitTaken']
    this.setValidation(setValArray, this.fIS);
    let fromvalue = this.internalSchemes.value;
    if (this.internalSchemes.invalid) {
      return;
    } else {
      if (!this.internalSchemesArray.length) {
        this.internalSchemesArray.push(fromvalue);
        this.commonMethod.snackBar("Add successfully", 0)
        this.ScheemDirective && this.ScheemDirective.resetForm();
      } else {
        let existedRecord = this.internalSchemesArray.find((res: any) => res.internalSchemeName == fromvalue.internalSchemeName);  
        if(existedRecord && !this.InternalSchemesEditFlag){
          this.commonMethod.snackBar("this Scheem already exist", 0);
          return
        }else{
          this.InternalSchemesEditFlag ? (this.internalSchemesArray[this.InternalSchemesIndex] = fromvalue,this.commonMethod.snackBar("Update successfully", 0)) : (this.internalSchemesArray.push(fromvalue),this.commonMethod.snackBar("Add successfully", 0));
          this.ScheemDirective && this.ScheemDirective.resetForm();
        }
      }                                                                                                                                                                                
      this.dataSource1 = new MatTableDataSource(this.internalSchemesArray);
      this.InternalSchemesEditFlag = false
    }
  }

  onEditInternalSchemes(obj: any, i: number){
    this.InternalSchemesEditFlag = true;
    this.InternalSchemesIndex = i;
    this.internalSchemesFormData(obj);
  }

 

  deleteInternalSchemes(index : any, flag?:any){
    console.log("falg",flag);
    if(flag == 'currentCropDetails'){
      this.currentCropDetailsArray.splice(index,1)
      this.dataSource = new MatTableDataSource(this.currentCropDetailsArray);
    }else{
      this.internalSchemesArray.splice(index,1)
      this.dataSource1 = new MatTableDataSource(this.internalSchemesArray);
      this.InternalSchemesEditFlag = false;
    }
  }



  //#region  -----------------------------------------------------------doc upload section fn start heare-----------------------------------//

  fileUpload(event: any, docId?: any,flag?:any) {
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray,'docTypeId',docId);     
    this.spinner.show();
    let type = 'jpg, jpeg, png, pdf'
    this.uploadService.uploadDocuments(event, 'ApplicationDocuments', type, '', '', this.lang).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
            flag == 'otherDoc'? this.uploadedDocUrl = res.responseData : flag == 'profilePhoto' ? this.profileImageUrl = res.responseData : this.docArray[indexByDocId].docPath = res.responseData;      
          this.commonMethod.snackBar(res.statusMessage, 0)
        }
      },
      error: ((error: any) => {
        this.spinner.hide();
        this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      })
    });
  }

  viewimage(obj: any) {
    window.open(obj, '_blank')
  }

  deleteDocument(docId: any) {
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray,'docTypeId',docId);
    this.docArray[indexByDocId]['docPath'] = '';
  }

  //#endregion  --------------------------------------------------------doc upload section fn end heare-----------------------------------//

submitOtherDoc(){
  let formValue = this.otherDocForm.value  
  let obj = {
      id:0,
      docTypeId:1,
      docPath:this.uploadedDocUrl,
      docNo:formValue.docNo,
      docname: formValue.docname
    }   
  this.otherDocArray.push(obj);
  this.uploadedDocUrl = '';
  this.dataSource2 = new MatTableDataSource(this.otherDocArray);
  this.DocumentDirective && this.DocumentDirective.resetForm();
}

deleteOtherDoc(index:any){
  this.otherDocArray.splice(index,1)
  this.dataSource2 = new MatTableDataSource(this.otherDocArray);
}

}


