import { Component,ElementRef,ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,NgForm,Validators } from '@angular/forms';
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
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-create-manarega-app',
  templateUrl: './create-manarega-app.component.html',
  styleUrls: ['./create-manarega-app.component.scss']
})
export class CreateManaregaAppComponent {
  manaregaFrm !: FormGroup;
  farmInfoFrm !: FormGroup;
  farmDeatailsFrm !: FormGroup;
  bankInfoFrm !: FormGroup;
  documentFrm !:FormGroup;
  otherDocumentFrm !: FormGroup;
  @ViewChild('uplodLogo') clearlogo!: any;
  imageResponse: string = '';
  subscription!: Subscription;//used  for lang conv
  lang: any;
  viewMsgFlag: boolean = false;//used for error msg show
  genderArray: any = [{ id: 1, name: 'Male' }, { id: 0, name: 'Female' }];
  checkedArray:any = [{id:true,name:'Yes'},{id:false,name:'No'}];
  selfTrainingArray:any = [{id:true,name:'Own'},{id:false,name:'Candidate'}];
  displayedColumns = ['srNo','plantName','gutNo','gutArea','cultivatedArea','cultivatedPlantsCount','actions'];
  plantDisplayedColumns = ['srNo','plantName','gutNo','gutArea','cultivatedArea','cultivatedPlantsCount'];
  qualificationArray = new Array();
  departmentArray = new Array();
  stateArray = new Array();
  districtArray = new Array();
  talukaArray = new Array();
  grampanchayatArray = new Array();
  categoryArray = new Array();
  irrigationFacilityArray = new Array();
  farmTypeArray = new Array();
  bankArray = new Array();
  branchArray = new Array();
  candidateRelationArray = new Array();
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
  index:any;
  farmDeatailsEditObj:any
  dataSource :any;
 @ViewChild('formDirective') private formDirective!: NgForm;
  //documnet form variable
  docUploadedPath: string = '';
  docArray = [{id:0,docTypeId:12,docPath:'',docNo:'',docname:'Job Card'},{id:0,docTypeId:19,docPath:'',docNo:'',docname:'8A Form'},{id:0,docTypeId:18,docPath:'',docNo:'',docname:'7-Dec'},
  {id:0,docTypeId:11,docPath:'',docNo:'',docname:'Nationalized Bank Passbook'}, {id:0,docTypeId:8,docPath:'',docNo:'',docname:'Registration Fee Receipt Path'}]
  visible:boolean = false;
  otherDocArray: any = new Array();
  @ViewChild('otherDocImage') OtherDocImg!: ElementRef;
   OtherDocUploadImg = new Array(); 
  @ViewChild('formDirectivess') private otherformDirective!: NgForm;
  documentdisplayedColumns:string[] = ['srNo', 'documentType', 'docNo', 'action'];
 //selfDeckaration form variable
  selfDeclarationFrm !: FormGroup
  //preview form variable
  previewData:any;
  previewManarega :any;

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
    this.getFarmInfo();
    this.addBankInfo();
    this.addDocumentFrm() 
    this.addSelfDeclaration();
    this.addOtherDocument();
    this.getDepartment();
    this.getQualification();
    this.getState();
    this.getCategory();
    this.getFarmType();
    this.getIrrigationFacility();
    this.getCandidateRelation();
    this.getBank();
    this.searchDataZone();
    this.getPreviewData();
  }
    //#region  -----------------------------------------------------------doc upload section fn start heare-----------------------------------//

    fileUpload(event: any, docId: any,lable:any) {

      let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray,'docTypeId',docId);
  
      this.spinner.show();
      let type = 'jpg, jpeg, png, pdf'
      this.fileUpl.uploadDocuments(event, 'ApplicationDocuments', type, '', '', this.lang).subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
            this.spinner.hide();
            if(lable == 'documents'){
              this.docArray[indexByDocId].docPath = res.responseData;
              console.log( this.docArray)
            }
            else if(lable == 'otherDocuments'){
              this.otherDocumentFrm.controls['docPath'].setValue(res.responseData)
              this.docArray[indexByDocId].docTypeId = 7; 
            }
           
            this.commonMethod.snackBar(res.statusMessage, 0)
          }
        },
        error: ((error: any) => {
          this.spinner.hide();
          this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
        })
      });
    }
  
    viewimages(obj: any) {
      window.open(obj, '_blank')
    }
  
    deleteDocument(docId: any) {
      let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray,'docTypeId',docId);
      this.docArray[indexByDocId]['docPath'] = '';
    }
  
/////////////////preview patch data
viewPreviewDocument(docId: any) {
  console.log("this.previewData?.documents",this.previewData?.documents)
  let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.previewData?.documents,'docId',docId);
  console.log("indexByDocId",indexByDocId)
 let obj= this.previewData?.documents[indexByDocId].documentPath;
 console.log("obj",this.previewData?.documents[2].documentPath)
 window.open(obj, '_blank')
}

// Define a function to filter and retrieve documents with docId 7
getDocumentsWithDocId7() {
  return this.previewData?.documents.filter((doc:any) => doc.docId === 7);
}

// Function to open the document in a new tab
viewPreviewDocument11(documentPath: string) {
  window.open(documentPath, '_blank');
}


    //#endregion  --------------------------------------------------------doc upload section fn end heare-----------------------------------//

    //#region -----------------other document upload functionality start --------------------------------------------------
     onOtherDocSubmit() {
    let uploadFrmValue = this.otherDocumentFrm.getRawValue();
    console.log(" uploadFrmValue", uploadFrmValue)
    if (!uploadFrmValue?.docname) {
      this.commonMethod.snackBar('Document name is  required', 1);
      return
    } else if (!uploadFrmValue?.docNo) {
      this.commonMethod.snackBar('Document number is  required', 1);
      return
    } else if (!uploadFrmValue?.docPath) {
      this.commonMethod.snackBar('Document path is  required', 1);
      return
    }
    else {
      let obj = {
        "id": 0,
        "applicationId": 0,//remove 0
        "docTypeId":7,
        "docNo":uploadFrmValue.docNo,
        "docname": uploadFrmValue.docname,
        "docPath": uploadFrmValue.docPath,
        "createdBy": 0,
        "isDeleted": false
      }
    // if (!this.editOtherDocForm) {
        this.OtherDocUploadImg.push(obj);
        console.log("this.otherDocumentFrm",this.OtherDocUploadImg)
      // } else {
      //   this.OtherDocUploadImg[this.selOtherDocIndex] = obj;
      //   this.editOtherDocForm = false;
      // }
      this.otherDocArray = new MatTableDataSource(this.OtherDocUploadImg);
      this.resetOtherDocForm();
    }
  }
    deleteOtherDocument(){
      this.OtherDocImg.nativeElement.value = '';
      this.otherDocumentFrm.controls['docPath'].setValue('');
    }


  resetOtherDocForm() {
    this.otherformDirective.resetForm();
    this.OtherDocImg.nativeElement.value = "";

  }

    deleteTableOtherDocument(i: any) { //logic for delete table document
    this.OtherDocUploadImg.splice(i,1)
    this.otherDocArray = new MatTableDataSource( this.OtherDocUploadImg);
  }
 //#endregion  --------------------------------------------------------other doc upload section fn end here-----------------------------------//

    
//#region -------------------------------Original Details------------------------------------------------
  addManaregaFrm() {
    this.manaregaFrm = this.fb.group({
      "id": [0],
      "farmerId": [10],
      "schemeTypeId": [1],
      "applicationNo": [0],
      "mobileNo1": [''],
      "aadharNo": [''],
      "profilePhotoPath": ['',[Validators.required]],
      "mn_DepartmentId": [''],
      "fullName": ['',[Validators.required,this.validation.minLengthValidator(5),this.validation.maxLengthValidator(100),Validators.pattern(this.validation.fullName)]],
      "mobileNo2": ['',[this.validation.maxLengthValidator(10),Validators.pattern(this.validation.mobile_No)]],
      "birthDate": ['',[Validators.required]],
      "gender": [1],//no
      "qualificationId": ['',[Validators.required]],//no
      "stateId": [this.WebStorageService.getStateId() == '' ? '' : this.WebStorageService.getStateId()],//no
      "districtId": [this.WebStorageService.getDistrictId() == '' ? '': this.WebStorageService.getDistrictId()],//no
      "talukaId": [this.WebStorageService.getTalukaId() == '' ? '' : this.WebStorageService.getTalukaId(),[Validators.required]],//no
      "grampanchayatId": [this.WebStorageService.getGrampanchayatId() == '' ? '' : this.WebStorageService.getGrampanchayatId(),[Validators.required]],//no
      "village": ['',[Validators.required]],
      "address": ['',[this.validation.maxLengthValidator(200),Validators.required]],//Mandetory Max:200, alphanumeric with special char
      "pinCode": ['',[Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.valPinCode)]],//Mandetory  Max: 6 digit, numeric
      "mn_JobCardNo": ['',[Validators.required,this.validation.maxLengthValidator(30)] ],//Mandetory  Max: 30 alphanumeric with sepcial char
      "categoryId": [''],//no, [Validators.required]
    })
  }

  addDocumentFrm() {
    this.documentFrm = this.fb.group({
      'allRequiredDocument' : [ '',[Validators.required]]
    })
  }

  addFarmInfo(){
    this.farmInfoFrm = this.fb.group({
      "id":[ this.getId],
      "benificiaryTotalFarm":['',[Validators.required,this.validation.maxLengthValidator(4),Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]], //Mandetory  Hectory हेक्टर - Max: 4 digit, float  
      "mulberryCultivatedSurveyNo": ['',[Validators.required,this.validation.maxLengthValidator(6),Validators.pattern(this.validation.onlyNumbers)]],//Mandetory  Max: 6 digit, numeric
      "cultivatedFarmInHector":['',[Validators.required,this.validation.maxLengthValidator(4),Validators.pattern(this.validation.onlyNumbers)]],//num  // Mandetory Hectory हेक्टर - Max: 4 digit, numeric
      "isJointAccHolder": [false],//true //Default - No
      "applicantFarmSurveyNo": [''],//19 A Mandetory 4 digit, numeric
      "applicantFarmArea": [''],//num   19 B Mandetory Hectory हेक्टर - Max: 4 digit, float
      "farmTypeId":['',[Validators.required]],//num Mandetory
    "irrigationFacilityId":['',[Validators.required]],//num Mandetory
    "isAnyPlantedBeforeGovScheme": [false],//true  //Default - No
    "isSelfTraining":[false],//true //Default - Own   Own स्वतः Candidate उमेदवार
    "candidateName":[''],//Mandetory  Max: 50, Alphabetic 
    "candidateRelationId": [''],//num  Mandetory
    })
  }

  onClickAccountHolder(val: any) {
    if (val == true) {
      this.farmInfoFrm.controls['applicantFarmSurveyNo'].setValidators([Validators.required,this.validation.maxLengthValidator(4),Validators.pattern(this.validation.onlyNumbers)]);
      this.farmInfoFrm.controls ['applicantFarmArea'].setValidators([Validators.required,this.validation.maxLengthValidator(4),Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]);
    } else {
      this.farmInfoFrm.controls['applicantFarmSurveyNo'].clearValidators();
      this.farmInfoFrm.controls['applicantFarmArea'].clearValidators();
      }
    this.farmInfoFrm.controls['applicantFarmSurveyNo'].updateValueAndValidity();
    this.farmInfoFrm.controls ['applicantFarmArea'].updateValueAndValidity();
   }

   onClickPlantedBeforeGovScheme(val: any) {
    if (val == true) {
      this.farmDeatailsFrm.controls ['plantName'].setValidators([Validators.required,this.validation.maxLengthValidator(50),Validators.pattern(this.validation.alphaNumericWithSpace)]);
      this.farmDeatailsFrm.controls['gutNo'].setValidators([Validators.required,this.validation.maxLengthValidator(6),Validators.pattern(this.validation.onlyNumbers)]);
      this.farmDeatailsFrm.controls ['gutArea'].setValidators([Validators.required,this.validation.maxLengthValidator(6),Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]);
      this.farmDeatailsFrm.controls['cultivatedArea'].setValidators([Validators.required,this.validation.maxLengthValidator(10),Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]);
      this.farmDeatailsFrm.controls ['cultivatedPlantsCount'].setValidators([Validators.required,this.validation.maxLengthValidator(4),Validators.pattern(this.validation.onlyNumbers)]);
    } else {
      this.farmDeatailsFrm.controls ['plantName'].clearValidators();
      this.farmDeatailsFrm.controls['gutNo'].clearValidators();
      this.farmDeatailsFrm.controls ['gutArea'].clearValidators();
      this.farmDeatailsFrm.controls['cultivatedArea'].clearValidators();
      this.farmDeatailsFrm.controls ['cultivatedPlantsCount'].clearValidators();
     }
     this.farmDeatailsFrm.controls ['plantName'].updateValueAndValidity();
     this.farmDeatailsFrm.controls['gutNo'].updateValueAndValidity();
     this.farmDeatailsFrm.controls ['gutArea'].updateValueAndValidity();
     this.farmDeatailsFrm.controls['cultivatedArea'].updateValueAndValidity();
     this.farmDeatailsFrm.controls ['cultivatedPlantsCount'].updateValueAndValidity();
  }

  onClickSelfTraining(val: any) {
    if (val == false) {
      this.farmInfoFrm.controls['candidateName'].setValidators([Validators.required,this.validation.maxLengthValidator(50),Validators.pattern(this.validation.alphabetWithSpace)]);
      this.farmInfoFrm.controls ['candidateRelationId'].setValidators([Validators.required]);
    } else {
      this.farmInfoFrm.controls['candidateName'].clearValidators();
      this.farmInfoFrm.controls['candidateRelationId'].clearValidators();
      }
    this.farmInfoFrm.controls['candidateName'].updateValueAndValidity();
    this.farmInfoFrm.controls ['candidateRelationId'].updateValueAndValidity();
   }




  addBankInfo(){
    this.bankInfoFrm = this.fb.group({
      "id":[ this.getId],
      "bankId": ['',[Validators.required]],//num
      "bankBranchId": ['',[Validators.required]],//num
      "bankIFSCCode": ['',[Validators.required,this.validation.maxLengthValidator(11),Validators.pattern(this.validation.bankIFSCCodeVal)]],
      "bankAccountNo": ['',[Validators.required,this.validation.maxLengthValidator(30),Validators.pattern(this.validation.onlyNumbers)]]
    })
  }

  addOtherDocument(){
    this.otherDocumentFrm = this.fb.group({
      "id": [0],
      "docNo": [''],
      "docname": [''],
      "docPath": ['']
    })
  }

  addSelfDeclaration(){
    this.selfDeclarationFrm = this.fb.group({
      "isHonestLabor": [false],
        "isSelfTransport": [false],
        "isEligibleGettingInstallmentAmount":[false],
        "isBoundByConditions":[false],
        "isPayMoreThanLimitedAmt": [false],
        "isSignedOnLetter":[false],
        "isChangedAcceptable": [false],
        "isSchemeCorrectAsPerSatbara": [false],
        "isJointAccHolderTermAcceptable": [false]
        // "sm_IsReadyToPlantNewMulberries": true,
        // "sm_IsHonestlyProtectPlant": true,
        // "sm_IsRequestForYourPriorConsent": true,
    })
  }

  get f() {
    return this.manaregaFrm.controls
  }

  onclick()
  {
    this.visible = !this.visible
  }
  

  

  getFarmInfo(){
    this.farmDeatailsFrm = this.fb.group({
      "id": [0],
      "plantName": ['',[Validators.required]],//Max 50, Alphanumeric
      "gutNo": ['',[Validators.required]],//6 digit, numeric
      "gutArea": ['',[Validators.required]],//6 digit, Float
      "cultivatedArea":['',[Validators.required]],//10 digit, Float
      "cultivatedPlantsCount":['',[Validators.required]] //Max 4 digit, Numeric
    })
  }

  onAddFarmInfo(){
    let data = this.farmDeatailsFrm.getRawValue();
   // var newArray = new Array();
    if( this.farmDeatailsFrm.invalid){
      return;
    }
    else{
      let obj ={
      "id": data.id,
      "applicationId":0,
      "plantName": data.plantName,
      "gutNo": Number(data.gutNo),
      "gutArea": Number(data.gutArea),
      "cultivatedArea": Number(data.cultivatedArea),
      "cultivatedPlantsCount": Number(data.cultivatedPlantsCount),
      "createdBy":0
      }
      this.farmDetails.push(obj);
      this.dataSource = new MatTableDataSource( this.farmDetails);
      this.formDirective?.resetForm();
      console.log("farmDetails",this.farmDetails)
    }
  }


  deleteFarmInfo(i:number){
    this.farmDetails.splice(i,1);
    this.dataSource= new MatTableDataSource(this.farmDetails);
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


  


getPreviewData(){
  this.apiService.setHttp('get','sericulture/api/Application/application-preview?Id=16&AadharNo=675676564545&MobileNo=8765456789&lan=en',false,false,false,'masterUrl');
  this.apiService.getHttp().subscribe({
    next:((res:any)=>{
      if(res.statusCode == "200"){
          this.previewData = res.responseData;
          console.log("vvvvvvvvvvvvvv",this.previewData)
          let documentArray = new Array()
          documentArray = res.responseData?.documents;

          documentArray.map((document:any) => {
            if(document.docId == 12){
              this.previewManarega =  this.previewManarega?.push(document);
             
            }
            console.log(" this.previewManarega", this.previewManarega)
            // const docId = 12;
            
          });

          // console.log("this.previewData?.appDoc",this.previewData.documents )
          // this.previewManarega = documentArray.filter((res: any) => res.docTypeId == 12);
          //console.log("this.previewManarega",this.previewManarega)
          }
      
      else{
        this.previewData = [];
      }
    })
  })
}
// docArray = [{id:0,docTypeId:12,docPath:'',docNo:'',docname:'Job Card'},{id:0,docTypeId:19,docPath:'',docNo:'',docname:'8A Form'},{id:0,docTypeId:18,docPath:'',docNo:'',docname:'7-Dec'},{id:0,docTypeId:11,docPath:'',docNo:'',docname:'Nationalized Bank Passbook'}]
  
// this.viewMsgFlag=false;
  onSubmit(flag?:any) {
    let mergeDocumentArray = [... this.docArray,...this.OtherDocUploadImg];
    
    if (this.manaregaFrm.invalid && flag == 'farmerInfo') {
      this.viewMsgFlag = true;
      return;
    }
    else if(this.farmInfoFrm.invalid && flag == 'farmInfo'){
      return
    }
    else if(this.bankInfoFrm.invalid && flag == 'bankInfo'){
      return
    }
    else if( this.documentFrm.invalid && flag == 'document'){
      for(let i=0 ;i< this.docArray.length;i++){
        this.documentFrm.controls['allRequiredDocument'].setValue('');
        if(this.docArray[i].docPath == '' && this.docArray[i].docTypeId != 18 && this.docArray[i].docTypeId != 8){
          let str = this.docArray[i].docTypeId == 12 ? (this.lang == 'en' ? 'Manrega Job Card' : 'मनरेगा जॉब कार्ड')   :  this.docArray[i].docTypeId == 19 ? (this.lang == 'en' ? '8 A track of Land' : 'जमिनीचा 8-अ') : this.docArray[i].docTypeId == 11  ? (this.lang == 'en' ? 'Bank Passbook / Cancelled Cheque' : 'पासबुक / रद्द केलेला चेक') : ''
          alert(str+ ' required')
          return
        }
      else{
        this.documentFrm.controls['allRequiredDocument'].setValue(1);
      }}

     }
    else {
      let formData = this.manaregaFrm?.getRawValue();
      //let farmDetails=this.farmDeatailsFrm.getRawValue();
      let farmInfo = this.farmInfoFrm.getRawValue();
        let bankInfo=this.bankInfoFrm.getRawValue();
        let declarationInfo=this.selfDeclarationFrm.getRawValue();
        this.docArray.map((ele:any)=>{
           ele.createdBy = 0;
           ele.isDeleted = false;
        })
     let obj ={
        "id": flag == 'farmerInfo' ? formData.id : this.getId,
        "farmerId": formData.farmerId,
        "schemeTypeId":formData.schemeTypeId,
        "applicationNo":String(formData.applicationNo),
        "profilePhotoPath": formData.profilePhotoPath,
        "fullName": formData.fullName,
        "m_FullName": formData.fullName,//enter marathi name
        "mn_DepartmentId":Number(formData.mn_DepartmentId),
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
        "benificiaryTotalFarm": Number(farmInfo.benificiaryTotalFarm) || 0,
        "sm_LandTenureCategories": 0,
        "mulberryCultivatedSurveyNo": farmInfo.mulberryCultivatedSurveyNo,
        "cultivatedFarmInHector":  Number(farmInfo.cultivatedFarmInHector),
        "isJointAccHolder":farmInfo.isJointAccHolder || false,
        "applicantFarmSurveyNo": farmInfo.applicantFarmSurveyNo,
        "applicantFarmArea": Number(farmInfo.applicantFarmArea),
        "farmTypeId":Number(farmInfo.farmTypeId),
        "irrigationFacilityId": Number(farmInfo.irrigationFacilityId),
        "sm_IrrigationPeriod": 0,
        "isAnyPlantedBeforeGovScheme":farmInfo.isAnyPlantedBeforeGovScheme || false,
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
        "isSelfTraining": farmInfo.isSelfTraining || false,
        "candidateName": farmInfo.candidateName,
        "candidateRelationId":Number(farmInfo.candidateRelationId),
        "sm_IsSilkIndustrtyTrainingReceived": true,
        "sm_SilkIndustrtyTrainingDetails": "string",
        "sm_IsEngagedInSilkIndustry": true,
        "sm_IsTakenBenefitOfInternalScheme": true,
        "sm_NameOfPlan": "string",
        "sm_PlanTakenDate": "2023-11-24T09:55:29.130Z",
        "sm_TakenPlanBenefit": "string",
        "bankId":Number(bankInfo.bankId),
        "bankBranchId": Number(bankInfo.bankBranchId),
        "bankIFSCCode": bankInfo.bankIFSCCode,
        "bankAccountNo": bankInfo.bankAccountNo,
        "isHonestlyProtectPlant": true,
        "isHonestLabor": declarationInfo.isHonestLabor,
        "isSelfTransport": declarationInfo.isSelfTransport,
        "isEligibleGettingInstallmentAmount": declarationInfo.isEligibleGettingInstallmentAmount,
        "isBoundByConditions": declarationInfo.isBoundByConditions,
        "isPayMoreThanLimitedAmt": declarationInfo.isPayMoreThanLimitedAmt,
        "isSignedOnLetter": declarationInfo.isSignedOnLetter,
        "isChangedAcceptable": declarationInfo.isChangedAcceptable,
        "isSchemeCorrectAsPerSatbara": declarationInfo.isSchemeCorrectAsPerSatbara,
        "isJointAccHolderTermAcceptable":declarationInfo.isJointAccHolderTermAcceptable,
        "sm_IsReadyToPlantNewMulberries": true,
        "sm_IsHonestlyProtectPlant": true,
        "sm_IsRequestForYourPriorConsent": true,
        "registrationFeeReceiptPath": "string",
        "createdBy": 0,
        "flag": flag == 'farmerInfo' ? 0 : flag == 'farmInfo'? 2 : flag == 'bankInfo' ?  3 : flag == 'document' ? 4 : flag == 'selfDeclaration' ? 5 : flag == 'preview' ? 6 : 7,
        "isUpdate": true,
        "appDoc": mergeDocumentArray,
        // [{
        //     "id": 0,
        //     "applicationId": 0,
        //     "docTypeId": 0,
        //     "docNo": "string",
        //     "docname": "string",
        //     "docPath": "string",
        //     "createdBy": 0,
        //     "isDeleted": true
        //   }
        // ],
        "categoryId": this.checkedItems.map((x:any)=>{return x.id}),
        "plantingDetails": this.farmDetails,
        "internalSchemes": [
          {
            "id": 0,
            "applicationId": 0,
            "internalSchemeName": "string",
            "schemeTakenDate": "2023-11-24T09:55:29.130Z",
            "totalBenefitTaken": 0,
            "createdBy": 0
          }
        ],
        "currentProducts": [
          {
            "id": 0,
            "applicationId": 0,
            "cropId": 0,
            "area": 0,
            "totalProduction": 0,
            "averageRate": 0,
            "totalProductionAmt": 0,
            "totalExpenses": 0,
            "netIncome": 0,
            "acreNetIncome": 0,
            "createdBy": 0,
            "isDeleted": true
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
            this.viewMsgFlag=false; 
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
    let bankId =  this.bankInfoFrm.getRawValue()?.bankId;
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
    if (talukaId != 0) {
    this.masterService.GetGrampanchayat(talukaId).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.grampanchayatArray = res.responseData;
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

 getCandidateRelation(){
    this.masterService.GetCandidateRelation().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.candidateRelationArray = res.responseData;
          }
        else {
          this.candidateRelationArray = [];
        }
      })
    })
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
        this.checkedItems = this.categoryArray?.filter(item => item.checked);
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


  























































































































































































// fileUpload(event: any, photoName: string) {
  //   this.spinner.show();
  //   let documentObj: any
  //   let type = photoName == 'img' ? 'jpg, jpeg, png' : 'pdf,mp3,mp4,jpg,jpeg,png,xls,xlsx,doc,docx';
  //   this.fileUpl.uploadDocuments(event, 'ApplicationDocuments', type).subscribe({
  //     next: (res: any) => {
  //       if (res.statusCode == 200) {
  //         this.spinner.hide();
  //         console.log("res.responseData",res.responseData);
  //         let fileName = res.responseData.split('/');
  //         let imageName = fileName.pop();
  //         console.log("imageName",imageName)
  //          if (photoName == 'OtherDocImg') {
  //           this.otherDocumentFrm.controls['docPath'].setValue(res.responseData)
  //         } 
  //         //let otherForm = this.otherDocumentFrm.getRawValue();
  //         else{
  //          documentObj = {
  //           "id": 0,
  //           "applicationId":this.getId  || 0,//remove 0
  //           "docTypeId":photoName == 'manaregaJobImg' ? 12 : photoName == 'EightAImg' ?  19 : photoName == 'SevenTweImg' ?  18 :photoName == 'BankPassImg' ? 11 : '',//7
  //           "docNo":'',
  //           "docname": imageName,
  //           "docPath": res.responseData,
  //           "createdBy": 0,
  //           // "isDeleted": true
  //           "isDeleted": false
  //         }
  //         photoName == 'manaregaJobImg' ? (this.manaregaJobUploadImg.push(documentObj),console.log("this.manaregaJobUploadImg",this.manaregaJobUploadImg), this.ManaregaImg.nativeElement.value = '') :
  //          photoName == 'EightAImg' ? (this.EightAUploadImg.push(documentObj),console.log("this.EightAUploadImg",this.EightAUploadImg), this.EightAImg.nativeElement.value = '') :
  //          photoName == 'SevenTweImg' ? (this.SevenTweUploadImg.push(documentObj),console.log("this.SevenTweUploadImg",this.SevenTweUploadImg), this.SevenTweImg.nativeElement.value = '') :
  //          photoName == 'BankPassImg' ? (this.BankPassUploadImg.push(documentObj),console.log("this.BankPassUploadImg",this.BankPassUploadImg),  this.BankPassImg.nativeElement.value = '') :
  //          //photoName == 'OtherDocImg' ? (this.OtherDocUploadImg.push(documentObj),console.log("this.OtherDocUploadImg",this.OtherDocUploadImg),  this.OtherDocImg.nativeElement.value = '') :
   
  //         this.commonMethod.snackBar(res.statusMessage, 0)
  //       }
  //     }
  //     },
  //     error: ((error: any) => {
  //       this.spinner.hide();
  //       this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
  //     })
  //   });
  // }
  // viewImages(obj?: any) {
  //   window.open(obj.docPath, 'blank');
  // }

  // deleteImges(photoName: string, i: number) {
  //   if (photoName == 'manaregaJobImg') {
  //     this.manaregaJobUploadImg.splice(i, 1);
  //   } 
  //   else if (photoName == 'EightAImg') {
  //     this.EightAUploadImg.splice(i, 1);
  //   }
  //   else if (photoName == 'SevenTweImg') {
  //     this.SevenTweUploadImg.splice(i, 1);
  //   }
  //   else if (photoName == 'BankPassImg') {
  //     this.BankPassUploadImg.splice(i, 1);
  //   }
  //   }

 


