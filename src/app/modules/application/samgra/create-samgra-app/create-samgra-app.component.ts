import { Component } from '@angular/core';
import { AddDetailsComponent } from './add-details/add-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/services/master.service';
import { ApiService } from 'src/app/core/services/api.service';
import { Subscription } from 'rxjs';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CategoryDetailsComponent } from '../../manarega/category-details/category-details.component';
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


  qualificationArray = new Array();
  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  grampanchayatArray = new Array();
  lang: any;
  categoryArray = new Array();
  bankArray = new Array();
  branchArray = new Array();
  farmTypeArray = new Array();
  irrigationFacilityArray = new Array();
  checkedItems = new Array();

  genderArray: any = [{ id: 1, name: 'Male' }, { id: 0, name: 'Female' }];
  checkedArray:any = [{id:true,name:'Yes'},{id:false,name:'No'}];
  subscription!: Subscription;

  constructor(public dialog: MatDialog,
    private masterService : MasterService,
    private commonMethod : CommonMethodsService,
    private apiService : ApiService,
    public WebStorageService : WebStorageService,
    private fb : FormBuilder,
    private spinner : NgxSpinnerService,
    private errorHandler : ErrorHandlingService
    ) {}
    ngOnInit() {
      this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
        this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
        this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
      })
   
      this.samgraformData();
      this.landDetailsFormData();
      this.bankDetailsFormData(); 
      this.commonDropdown();
      
    }

    commonDropdown(){
      this.getQualification();
      this.getState();
      this.getFarmType();
      this.getIrrigationFacility();
      this.getBank();
      this.getCategory();
    }
    get f() {
      return this.samgraForm.controls
    }
    
    samgraformData(){
      this.samgraForm = this.fb.group({  
        "id" : [0] ,      
        "fullName" : [''],
        "mobileNo1":[''],
        "birthDate" : [''],
        "gender" : [''],
        "qualificationId" : [0],
        "stateId":[this.WebStorageService.getStateId() == '' ? 0 : this.WebStorageService.getStateId()],
        "districtId":[this.WebStorageService.getDistrictId() == '' ? 0 : this.WebStorageService.getDistrictId()],
        "talukaId":[this.WebStorageService.getTalukaId() == '' ? 0 : this.WebStorageService.getTalukaId()],
        "grampanchayatId":[this.WebStorageService.getGrampanchayatId() == '' ? 0 : this.WebStorageService.getGrampanchayatId()],
        "village":[''],
        "pinCode":[''],
        "sm_VoterRegistrationNo":[''],
        "address":[''],
        "sm_IsBelowPovertyLine": true,
        "categoryId": [
          0
        ],        
        
      })
    }

    landDetailsFormData(){
      this.landDetailsForm = this.fb.group({
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
        "sm_YearOfPlanting": "2023-11-30T04:40:28.670Z",
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
        "sm_IsTakenBenefitOfInternalScheme": true,
        "sm_IsEngagedInSilkIndustry": true,
      })
    }

    bankDetailsFormData(){
      this.bankDetailsForm = this.fb.group({
        "bankId": 0,
        "bankBranchId": 0,
        "bankIFSCCode": "string",
        "bankAccountNo": "string",
      })
    }

    
  getQualification(){
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

  getTaluka() {
    this.talukaArray = [];
    let stateId = this.samgraForm.getRawValue()?.stateId;
    let disId = this.samgraForm.getRawValue()?.districtId;
    if (disId != 0) {
      this.masterService.GetAllTaluka(stateId, disId, 0).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.talukaArray = res.responseData;
            this.getGrampanchayat()
          }
          else {
            this.talukaArray = [];
            // this.talukaSubject.next(null);
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
        if (res.statusCode == "200" && res.responseData?.length) {
          this.grampanchayatArray = res.responseData;
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
          this.categoryArray =  res.responseData.filter((ele:any)=>{return ele.isRadioButton == 1})     
        }
        else {
          this.categoryArray = [];
        }
      }
    })
  }



  getFarmType(){
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

  
  getBank() {
    this.bankArray= [];
    this.masterService. GetBank().subscribe({
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
    this.branchArray= [];
    let bankId =  this.bankDetailsForm.getRawValue()?.bankId;
    if(bankId != 0){
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

 



  onSubmit(){
    let samgraFormValue = this.samgraForm.value;
    let landDetailsFormValue = this.landDetailsForm.value; 
    let bankDetailsFormValue = this.bankDetailsForm.value;

    let obj = {
      "id": samgraFormValue.id,
      "farmerId": 0,
      "schemeTypeId": 0,
      "applicationNo": "",
      "profilePhotoPath": "",
      "fullName": samgraFormValue.fullName,
      "m_FullName": "",
      "mn_DepartmentId": 0,
      "mobileNo1": samgraFormValue.mobileNo1,
      "mobileNo2": "",
      "aadharNo": "",
      "isAgreeReadableInfo": true,
      "birthDate": samgraFormValue.birthDate,
      "gender": samgraFormValue.gender,
      "qualificationId": samgraFormValue.qualificationId,
      "stateId": samgraFormValue.stateId,
      "districtId": samgraFormValue.districtId,
      "talukaId": samgraFormValue.talukaId,
      "grampanchayatId": samgraFormValue.grampanchayatId,
      "village": samgraFormValue.village,
      "address": samgraFormValue.address,
      "m_Address": "",
      "pinCode": samgraFormValue.pinCode,
      "mn_JobCardNo": "",
      "sm_VoterRegistrationNo": samgraFormValue.sm_VoterRegistrationNo,
      "sm_IsBelowPovertyLine": samgraFormValue.sm_IsBelowPovertyLine,
      "benificiaryTotalFarm": landDetailsFormValue.benificiaryTotalFarm,
      "sm_LandTenureCategories": landDetailsFormValue.sm_LandTenureCategories,
      "mulberryCultivatedSurveyNo": landDetailsFormValue.mulberryCultivatedSurveyNo,
      "cultivatedFarmInHector": landDetailsFormValue.cultivatedFarmInHector,
      "isJointAccHolder": landDetailsFormValue.isJointAccHolder,
      "applicantFarmSurveyNo": landDetailsFormValue.applicantFarmSurveyNo,
      "applicantFarmArea": landDetailsFormValue.applicantFarmArea,
      "farmTypeId": landDetailsFormValue.farmTypeId,
      "irrigationFacilityId": landDetailsFormValue.irrigationFacilityId,
      "sm_IrrigationPeriod": landDetailsFormValue.sm_IrrigationPeriod,
      "isAnyPlantedBeforeGovScheme": landDetailsFormValue.isAnyPlantedBeforeGovScheme,
      "plantName": landDetailsFormValue.plantName,
      "gutNo": landDetailsFormValue.gutNo,
      "gutArea": landDetailsFormValue.gutArea,
      "plantCultivatedArea": landDetailsFormValue.plantCultivatedArea,
      "noOfPlant": landDetailsFormValue.noOfPlant,
      "sm_YearOfPlanting": landDetailsFormValue.sm_YearOfPlanting,
      "sm_CultivatedArea": landDetailsFormValue.sm_CultivatedArea,
      "sm_LandSurveyNo": landDetailsFormValue.sm_LandSurveyNo,
      "sm_ImprovedMulberryCast":landDetailsFormValue.sm_ImprovedMulberryCast,
      "sm_MulberryPlantingDistance":landDetailsFormValue.sm_MulberryPlantingDistance,
      "sm_PlantationSurveyNo": landDetailsFormValue.sm_PlantationSurveyNo,
      "sm_MulberryCultivationArea": landDetailsFormValue.sm_MulberryCultivationArea,
      "sm_PlantationMethod": landDetailsFormValue.sm_PlantationMethod,
      "sm_IsExperienceSilkIndustry": landDetailsFormValue.sm_IsExperienceSilkIndustry,
      "sm_ExperienceYears": landDetailsFormValue.sm_ExperienceYears,
      "isSelfTraining": landDetailsFormValue.isSelfTraining,
      "candidateName": landDetailsFormValue.candidateName,
      "candidateRelationId": landDetailsFormValue.candidateRelationId,
      "sm_IsSilkIndustrtyTrainingReceived": landDetailsFormValue.sm_IsSilkIndustrtyTrainingReceived,
      "sm_SilkIndustrtyTrainingDetails": landDetailsFormValue.sm_SilkIndustrtyTrainingDetails,
      "sm_IsEngagedInSilkIndustry": landDetailsFormValue.sm_IsEngagedInSilkIndustry,
      "sm_IsTakenBenefitOfInternalScheme": landDetailsFormValue.sm_IsTakenBenefitOfInternalScheme,
      "sm_NameOfPlan": "",
      "sm_PlanTakenDate": new Date(),
      "sm_TakenPlanBenefit": "",
      "bankId": bankDetailsFormValue.bankId,
      "bankBranchId": bankDetailsFormValue.bankBranchId,
      "bankIFSCCode": bankDetailsFormValue.bankIFSCCode,
      "bankAccountNo": bankDetailsFormValue.bankAccountNo,
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
      "registrationFeeReceiptPath": "",
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
      "categoryId":this.checkedItems.map((res:any)=>{return res.id}),
      "plantingDetails": [
        {
          "id": 0,
          "applicationId": 0,
          "plantName": "string",
          "gutNo": 0,
          "gutArea": 0,
          "cultivatedArea": 0,
          "cultivatedPlantsCount": 0,
          "createdBy": 0,
          "isDeleted": true
        }
      ],
      "internalSchemes": [
        {
          "id": 0,
          "applicationId": 0,
          "internalSchemeName": "string",
          "schemeTakenDate": "2023-12-01T04:55:58.526Z",
          "totalBenefitTaken": 0,
          "createdBy": 0
        }
      ]
    }

    console.log("object",obj);

    return

    this.apiService.setHttp('post', 'sericulture/api/Application/Insert-Update-Application?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            // this.getId = res.responseData;
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


  adddetails(){
    this.dialog.open(AddDetailsComponent,{
      width:'50%'
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
      console.log("result",result);
      if(result == 'true'){
        return;
      }else if(result){
        this.categoryArray = result;
        this.checkedItems = this.categoryArray.filter(item => item.checked); 
        console.log("this.checkedItems",this.checkedItems);
        
      }
    });
  }
  
  displayedColumns: string[] = ['srno', 'cropname', 'area', 'doneProdQuintal', 'recievedpriceperkg','doneProductionQty','recievedcost','doneproductionRs','perekarprodRs'];
  dataSource = ELEMENT_DATA;


}

export interface PeriodicElement {
  srno: number;
  cropname: string;
  area: string;
  doneProdQuintal: string;
  recievedpriceperkg :string;
  doneProductionQty:string;
  recievedcost:string;
  doneproductionRs:string;
  perekarprodRs:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {srno: 1, cropname: 'Hydrogen', area: '1', doneProdQuintal: '8',recievedpriceperkg:'120', doneProductionQty:'960000', recievedcost:'15000', doneproductionRs:'81000',perekarprodRs:'40500'   }
];
