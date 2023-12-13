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
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
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
  addRegistrationRecFrm !: FormGroup;
  filterFrm !: FormGroup;
  profileImageUrl: any;
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
  index:any;
  farmDeatailsEditObj:any
  dataSource :any;
  EditFlag: boolean = false;
  filterDataRes:any // used for store filter data res
 @ViewChild('formDirective') private formDirective!: NgForm;
  //documnet form variable
  docUploadedPath: string = '';
  docArray = [{id:0,docTypeId:12,docPath:'',docNo:'',docname:'Job Card'},{id:0,docTypeId:19,docPath:'',docNo:'',docname:'8A Form'},{id:0,docTypeId:18,docPath:'',docNo:'',docname:'7-Dec'},
  {id:0,docTypeId:11,docPath:'',docNo:'',docname:'Nationalized Bank Passbook'}, {id:0,docTypeId:8,docPath:'',docNo:'',docname:'Registration Fee Receipt'}]
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
  routingData: any;//used for get routing data

  constructor(public dialog: MatDialog,
    private apiService: ApiService,
    public WebStorageService: WebStorageService,
    private fb: FormBuilder,
    private fileUpl: FileUploadService,
    private spinner: NgxSpinnerService,
    private errorHandler: ErrorHandlingService,
    private commonMethod: CommonMethodsService,
    public validation: ValidationService,
    private masterService: MasterService,
    private route: ActivatedRoute, 
    private router: Router,
    public encryptdecrypt: AesencryptDecryptService,
  ) { }

  ngOnInit() {
    
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getRouteParam();
    this.addManaregaFrm();
    this.addFarmInfo();
    this.getFarmInfo();
    this.addBankInfo();
    this.addDocumentFrm();
    this.filterDefaultFrm();  
    this.addSelfDeclaration();
    this.addOtherDocument();
    this.addRegistrationFrm();
    this.commonDropdown();
    }

    commonDropdown(){
      this.getDepartment();
      this.getQualification();
      this.getState();
      this.getCategory();
      this.getFarmType();
      this.getIrrigationFacility();
      this.getCandidateRelation();
      this.getBank();
      this.searchDataZone();
    }

    getRouteParam(){
      this.route.queryParams.subscribe((queryParams: any) => {
        this.routingData = queryParams['id'];
      });
    let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');
     console.log("spliteUrl",spliteUrl);
      let url = this.router.url;
      console.log("url",url);
      let appProVal = (spliteUrl[1] == 'm') && (url.split('?')[0] == '/create-manarega-app');
      console.log("appProVal",appProVal)
      // if (!appProVal) {
      //   this.router.navigate(['../application']);
      //   this.commonMethod.snackBar('Something went wrong please try again', 1);
      // }
      
      this.getPreviewData1('edit',spliteUrl[0]);
      
  
    }
    
  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      mobileNo: [''],
     aadharNo: [''],
    })
  }
  
  //#region --------------form start here---------------------
  addManaregaFrm(data?:any) {
    this.manaregaFrm = this.fb.group({
      "id": [data?.id || 0],
      "farmerId": [data?.farmerId || 10],
      "schemeTypeId": [1],
      "applicationNo": [data?.applicationNo || ''],
      "mobileNo1": [data?.mobileNo1 || '',[Validators.required,this.validation.maxLengthValidator(10),Validators.pattern(this.validation.mobile_No)]],
      "aadharNo": [data?.aadharNo || '',[Validators.required,this.validation.maxLengthValidator(12),Validators.pattern(this.validation.aadhar_card)]],
      // "profilePhotoPath": ['',[Validators.required]],
      "mn_DepartmentId": [data?.mn_DepartmentId || ''],
      "fullName": [data?.fullName || '',[Validators.required,this.validation.minLengthValidator(5),this.validation.maxLengthValidator(100),Validators.pattern(this.validation.fullName)]],
      "mobileNo2": [data?.mobileNo2 || '',[this.validation.maxLengthValidator(10),Validators.pattern(this.validation.mobile_No)]],
      "birthDate": [data?.birthDate || '',[Validators.required]],
      "gender": [data?.genderId || 1],//no
      "qualificationId": [data?.qualificationId ||'',[Validators.required]],//no
      "stateId": [data?.stateId || (this.WebStorageService.getStateId() == '' ? '' : this.WebStorageService.getStateId())],//no
      "districtId": [data?.districtId || (this.WebStorageService.getDistrictId() == '' ? '': this.WebStorageService.getDistrictId())],//no
      "talukaId": [data?.talukaId || (this.WebStorageService.getTalukaId() == '' ? '' : this.WebStorageService.getTalukaId()),[Validators.required]],//no
      "grampanchayatId": [data?.grampanchayatId || (this.WebStorageService.getGrampanchayatId() == '' ? '' : this.WebStorageService.getGrampanchayatId()),[Validators.required]],//no
      "village": [data?.village || '',[Validators.required]],
      "address": [data?.address || '',[this.validation.maxLengthValidator(200),Validators.required]],//Mandetory Max:200, alphanumeric with special char
      "pinCode": [data?.pinCode || '',[Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.valPinCode)]],//Mandetory  Max: 6 digit, numeric
      "mn_JobCardNo": [data?.mn_JobCardNo || '',[Validators.required,this.validation.maxLengthValidator(30)] ],//Mandetory  Max: 30 alphanumeric with sepcial char
      "categoryId": [''],//no, [Validators.required]
    })
  }

  addDocumentFrm() {
    this.documentFrm = this.fb.group({
      'allRequiredDocument' : [ '',[Validators.required]]
    })
  }

  addRegistrationFrm() {
    this.addRegistrationRecFrm = this.fb.group({
      'registrationDocument' : [ '',[Validators.required]]
    })
  }

  addFarmInfo(data?:any){
    this.farmInfoFrm = this.fb.group({
      "benificiaryTotalFarm":[data?.benificiaryTotalFarm || '',[Validators.required,this.validation.maxLengthValidator(4),Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]], //Mandetory  Hectory हेक्टर - Max: 4 digit, float  
      "mulberryCultivatedSurveyNo": [data?.mulberryCultivatedSurveyNo || '',[Validators.required,this.validation.maxLengthValidator(6),Validators.pattern(this.validation.onlyNumbers)]],//Mandetory  Max: 6 digit, numeric
      "cultivatedFarmInHector":[data?.cultivatedFarmInHector || '',[Validators.required,this.validation.maxLengthValidator(4),Validators.pattern(this.validation.onlyNumbers)]],//num  // Mandetory Hectory हेक्टर - Max: 4 digit, numeric
      "isJointAccHolder": [data?.isJointAccHolder || false],//true //Default - No
      "applicantFarmSurveyNo": [data?.applicantFarmSurveyNo || ''],//19 A Mandetory 4 digit, numeric
      "applicantFarmArea": [data?.applicantFarmArea || ''],//num   19 B Mandetory Hectory हेक्टर - Max: 4 digit, float
      "farmTypeId":[data?.farmTypeId || '',[Validators.required]],//num Mandetory
    "irrigationFacilityId":[data?.irrigationFacilityId || '',[Validators.required]],//num Mandetory
    "isAnyPlantedBeforeGovScheme": [data?.isAnyPlantedBeforeGovScheme || false],//true  //Default - No
    "isSelfTraining":[data?.isSelfTraining || false],//true //Default - Own   Own स्वतः Candidate उमेदवार
    "candidateName":[data?.candidateName || ''],//Mandetory  Max: 50, Alphabetic 
    "candidateRelationId": [data?.candidateRelationId ||''],//num  Mandetory
    })
  }
  
  addBankInfo(data?:any){
    this.bankInfoFrm = this.fb.group({
      "bankId": [data?.bankId || '',[Validators.required]],//num
      "bankBranchId": [data?.bankBranchId || '',[Validators.required]],//num
      "bankIFSCCode": [data?.bankIFSCCode || '',[Validators.required,this.validation.maxLengthValidator(11),Validators.pattern(this.validation.bankIFSCCodeVal)]],
      "bankAccountNo": [data?.bankAccountNo || '',[Validators.required,this.validation.maxLengthValidator(30),Validators.pattern(this.validation.onlyNumbers)]]
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

  addSelfDeclaration(res?:any){
    this.selfDeclarationFrm = this.fb.group({
      "isHonestLabor": [res?.isHonestLabor || false],
        "isSelfTransport": [ res?.isSelfTransport || false],
        "isEligibleGettingInstallmentAmount":[res?.isEligibleGettingInstallmentAmount || false],
        "isBoundByConditions":[res?.isBoundByConditions || false],
        "isPayMoreThanLimitedAmt": [res?.isPayMoreThanLimitedAmt || false],
        "isSignedOnLetter":[res?.isSignedOnLetter || false],
        "isChangedAcceptable": [res?.isChangedAcceptable || false],
        "isSchemeCorrectAsPerSatbara": [res?.isSchemeCorrectAsPerSatbara || false],
        "isJointAccHolderTermAcceptable": [res?.isJointAccHolderTermAcceptable || false]
      })
  }

  get f() {
    return this.manaregaFrm.controls
  }
  
 //#endregion--------------------form end here------------------------------------------ 
//#region  -----------------------------------------------------------doc upload section fn start heare-----------------------------------//

    fileUpload(event: any, docId: any,lable:any) {
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray,'docTypeId',docId);
      this.spinner.show();
      let type = 'jpg, jpeg, png, pdf'
      this.fileUpl.uploadDocuments(event, 'ApplicationDocuments', type, '', '', this.lang).subscribe({
        next: (res: any) => {
          if (res.statusCode == 200) {
            this.spinner.hide();
            lable == 'documents' ? this.docArray[indexByDocId].docPath = res.responseData : lable == 'profilePhoto' ? this.profileImageUrl = res.responseData :
            (this.otherDocumentFrm.controls['docPath'].setValue(res.responseData),this.docArray[indexByDocId].docTypeId = 7);//lable == 'otherDocuments'
             }
             this.commonMethod.snackBar(res.statusMessage, 0)
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
 //#endregion  --------------------------------------------------------doc upload section fn end here-----------------------------------//
viewPreviewDocument(docId: any) {//preview document
let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.previewData?.documents,'docId',docId);
let obj= this.previewData?.documents[indexByDocId].documentPath;
window.open(obj, '_blank')
}
getDocumentsWithDocId7() {  //preview other docment
  return this.previewData?.documents.filter((doc:any) => doc.docId === 7);
}

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
        "applicationId":this.manaregaFrm.getRawValue()?.id || 0,//remove 0
        "docTypeId":7,
        "docNo":uploadFrmValue.docNo,
        "docname": uploadFrmValue.docname,
        "docPath": uploadFrmValue.docPath,
        "createdBy":this.WebStorageService.getUserId(),
        "isDeleted":true
      }

      if (!this.OtherDocUploadImg.length) {
        this.OtherDocUploadImg.push(obj);
        this.commonMethod.snackBar("Add successfully", 0)
       //reset form code remainingresetForm();
      }
      else{
        let existedName = this.OtherDocUploadImg.find((res: any) => res.docname == uploadFrmValue.docname);
        let existedPath = this.OtherDocUploadImg.find((res: any) => res.docname == uploadFrmValue.docname);
      
        if (existedName) {
          this.commonMethod.snackBar("Document Name Already exist", 1);
          return
        }
        else if(existedPath){
          this.commonMethod.snackBar("Document Path Already exist", 1);
          return
        }
        else {
          this.OtherDocUploadImg.push(obj);
          //reset form code remainingresetForm();
        }
      }
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
//#region -------------------------------on radio button click add remove validation fn start------------------------------------------------
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
      this.farmDeatailsFrm.controls ['cultivatedPlantsCount'].setValidators([Validators.required,this.validation.maxLengthValidator(6),Validators.pattern(this.validation.onlyNumbers)]);
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
//#endregion-----------------------on radio button click add remove validation fn start-------------------

  getFarmInfo(){
    this.farmDeatailsFrm = this.fb.group({
      "id": [0],
      "plantName": [''],//Max 50, Alphanumeric
      "gutNo": [''],//6 digit, numeric
      "gutArea": [''],//6 digit, Float
      "cultivatedArea":[''],//10 digit, Float
      "cultivatedPlantsCount":[''] //Max 4 digit, Numeric
    })
  }
   onAddFarmInfo(){
    this.onClickPlantedBeforeGovScheme(true);
    let data = this.farmDeatailsFrm.getRawValue();
    if( this.farmDeatailsFrm.invalid){
      return;
    }
    else{
      let obj ={
      "id": 0,
      "applicationId":this.manaregaFrm.getRawValue()?.id,
      "plantName": data.plantName,
      "gutNo": Number(data.gutNo),
      "gutArea": Number(data.gutArea),
      "cultivatedArea": Number(data.cultivatedArea),
      "cultivatedPlantsCount": Number(data.cultivatedPlantsCount),
      "createdBy":this.WebStorageService.getUserId(),
      }
      this.farmDetails.push(obj);
      this.dataSource = new MatTableDataSource( this.farmDetails);
      this.onClickPlantedBeforeGovScheme(false);
      this.formDirective?.resetForm();
      console.log("farmDetails",this.farmDetails)
    }
  }

 deleteFarmInfo(i:number){
    this.farmDetails.splice(i,1);
    this.dataSource= new MatTableDataSource(this.farmDetails);
   }

getPreviewData1(flag?:any,id?:any){ 
 let filterData = this.filterFrm?.getRawValue();
  let url = flag == 'search' ? `sericulture/api/Application/application-preview?Id=0&AadharNo=${filterData?.aadharNo}&MobileNo=${filterData?.mobileNo}&lan=${this.lang}` :'sericulture/api/Application/application-preview?Id='+(id)+'&lan='+this.lang ;
  this.apiService.setHttp('get',url,false,false,false,'masterUrl')
  this.apiService.getHttp().subscribe({
   next:((res:any)=>{
     if(res.statusCode == "200"){
         this.previewData = res.responseData;
         this.onEdit(this.previewData);
        let documentArray = new Array()
         documentArray = res.responseData?.documents;

         documentArray.map((document:any) => {
           if(document.docId == 12){
              this.previewManarega?.push(document);
            }
         });
        }
     else{
       this.previewData = [];
     }
   })
 })
}




getPreviewData(res?:any){ 
   this.apiService.setHttp('get','sericulture/api/Application/application-preview?Id='+(res)+'&lan='+this.lang,false,false,false,'masterUrl')
   this.apiService.getHttp().subscribe({
    next:((res:any)=>{
      if(res.statusCode == "200"){
          this.previewData = res.responseData;
          this.onEdit(this.previewData);
         let documentArray = new Array()
          documentArray = res.responseData?.documents;

          documentArray.map((document:any) => {
            if(document.docId == 12){
               this.previewManarega?.push(document);
             }
          });
         }
      else{
        this.previewData = [];
      }
    })
  })
}



onEdit(data?:any){
  console.log(data);
  this.EditFlag = true;
  this.addManaregaFrm(data);
  this.addFarmInfo(data);
  this.getState();
  this.profileImageUrl = data.profilePhotoPath;

  this.checkedItems = data.categoryOfBeneficiaries;

  this.categoryArray.map((ele:any)=>{
    this.checkedItems .find((item:any)=>{
      if(ele.id == item.id){
        ele.checked = true
      }
    })
  })

  this.checkedItems.map((ele: any) => {
        ele['textEnglish'] = ele.categoryOfBeneficiary;
         ele['textMarathi'] = ele.m_CategoryOfBeneficiary;
   })
  this.addBankInfo(data);
  this.getBank(); 
  this.getBankBranch();
  this.farmDetails = data.plantingDetails;
  this.dataSource = new MatTableDataSource(this.farmDetails);
    data.documents.find((item: any) => {
      this.docArray.find((ele: any, i: any) => {
      if (ele.docTypeId == item.docId) {
        this.docArray[i].id = item.id
        this.docArray[i].docPath = item.documentPath
      } else {
        if (item.docTypeId == 7) { // 7 is other doc
          let checkValue =  this.OtherDocUploadImg.some((ele:any)=>ele.id == item.id)
          !checkValue ? this.OtherDocUploadImg.push(item): '';
         }
      }
    })
  })
  this.OtherDocUploadImg.length ? this.visible = true :  this.visible = false; 
  this.otherDocArray = new MatTableDataSource(this.OtherDocUploadImg);
  this.addSelfDeclaration(data);
}


// 6853535353  668686838835
  






  onSubmit(flag?:any) {
    let formData = this.manaregaFrm?.getRawValue();
    //let farmDetails=this.farmDeatailsFrm.getRawValue();
    let farmInfo = this.farmInfoFrm.getRawValue();
      let bankInfo=this.bankInfoFrm.getRawValue();
      let declarationInfo=this.selfDeclarationFrm.getRawValue();
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
       this.docArray[i].docTypeId == 12 ? this.commonMethod.snackBar((this.lang == 'en' ? 'Manrega Job Card Required' : 'मनरेगा जॉब कार्ड आवश्यक'), 1) : this.docArray[i].docTypeId == 19 ? this.commonMethod.snackBar((this.lang == 'en' ? '8 A track of Land Required' : 'जमिनीचा 8-अ आवश्यक'), 1) : this.docArray[i].docTypeId == 11  ? this.commonMethod.snackBar((this.lang == 'en' ? 'Bank Passbook / Cancelled Cheque Required' : 'पासबुक / रद्द केलेला चेक आवश्यक'), 1) : '';
           return
        }
      else{
        this.documentFrm.controls['allRequiredDocument'].setValue(1);
      }}
      }
      else if(this.addRegistrationRecFrm.invalid && flag == 'challan'){
        for(let i=0 ;i< this.docArray.length;i++){
          this.addRegistrationRecFrm.controls['registrationDocument'].setValue('');
          if(this.docArray[i].docPath == ''){
            this.docArray[i].docTypeId == 8 ? this.commonMethod.snackBar((this.lang == 'en' ? 'Registration Fee Receipt Required' : 'नोंदणी फी पावती आवश्यक'), 1) : '';
            return;
           }
           else{
            this.addRegistrationRecFrm.controls['registrationDocument'].setValue(1);
           }
        }
      }
    else {
      !bankInfo.bankId ? bankInfo.bankId = 0 : '';
      !bankInfo.bankBranchId ? bankInfo.bankBranchId = 0 : '';
       console.log(" this.farmDetails in submit", this.farmDetails)
        this.docArray.map((ele:any)=>{
           ele.createdBy = this.WebStorageService.getUserId();
           ele.isDeleted = false;
           ele.applicationId = formData.id;
        })
     let obj ={
      ...formData, ...declarationInfo,...bankInfo,
        "m_Address": "",
        "m_FullName": "",
        "profilePhotoPath": this.profileImageUrl || '',
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
        "isHonestlyProtectPlant": true,
        "sm_IsReadyToPlantNewMulberries": true,
        "sm_IsHonestlyProtectPlant": true,
        "sm_IsRequestForYourPriorConsent": true,
        "registrationFeeReceiptPath": "string",
        "createdBy": this.WebStorageService.getUserId(),
        "flag": (flag == 'farmerInfo' && !this.EditFlag) ? 0 : (flag == 'farmerInfo' && this.EditFlag) ? 1 : flag == 'farmInfo'? 2 : flag == 'bankInfo' ?  3 : flag == 'document' ? 4 : flag == 'selfDeclaration' ? 5 : flag == 'preview' ? 6 :  flag == 'challan' ? 7 : '',
        "isUpdate": true,
        "appDoc": mergeDocumentArray,
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
            this.getPreviewData(res.responseData);
            //getId = res.responseData;
            this.manaregaFrm?.controls['id'].setValue(res.responseData);
            (res.responseData  && flag == 'challan')? this.handleClick(res):"";
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.viewMsgFlag=false; 
            flag == 'challan'? this.router.navigate(['../application']) : ''; 
            
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
          this.EditFlag ? this.bankInfoFrm.controls['bankId'].setValue(this.previewData?.bankId) : '' ;  
    
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
          this.EditFlag ? this.bankInfoFrm.controls['bankBranchId'].setValue(this.previewData?.bankBranchId):  '' ;  
    
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
         this.EditFlag ? (this.f['stateId'].setValue(this.previewData?.stateId), this.getDisrict()) :  this.getDisrict() ;  
        //  this.getDisrict();
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
            this.EditFlag ? (this.f['districtId'].setValue(this.previewData?.districtId),this.getTaluka()) : this.getTaluka() ;  
           //this.getTaluka();
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
            this.EditFlag ? (this.f['talukaId'].setValue(this.previewData.talukaId),this.getGrampanchayat()) :this.getGrampanchayat();
            //this.getGrampanchayat()
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
           this.EditFlag ? (this.f['grampanchayatId'].setValue(this.previewData?.grampanchayatId)) : '';
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
          this.EditFlag ? (this.farmInfoFrm.controls['farmTypeId'].setValue(this.previewData?.farmTypeId)) : '';
     
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
          this.EditFlag ? (this.farmInfoFrm.controls['candidateRelationId'].setValue(this.previewData?.candidateRelationId)) : '';
     
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
        this.checkedItems = [];
        this.categoryArray = result;
        this.categoryArray?.find(item => {
          if (item.checked) {
            this.checkedItems.push(item)
          }
        }
        );
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

  openDialog(res?:any) {
    // let userEng = obj.status == false ? 'Active' : 'Deactive';
    // let userMara = obj.status == false ? 'सक्रिय' : 'निष्क्रिय';
    let dialoObj = {
      header: this.lang == 'mr-IN' ? 'अभिनंदन ' : 'Congratulations',
      title: this.lang == 'mr-IN' ? 'आपला आरजा यशस्वी रित्या सादर झाला आहे.आरजा क्रं : '+ res.responseData1 + res.responseData2 : 'आपला आरजा यशस्वी रित्या सादर झाला आहे.आरजा क्रं : '+res.responseData1 + res.responseData2,
      cancelButton: '',
      okButton: this.lang == 'mr-IN' ? 'ओके' : 'Ok',
      headerImage: 'assets/images/check.png'
    }
    this.dialog.open(GlobalDialogComponent, {
      width: '320px',
      data: dialoObj,
      disableClose: true,
      autoFocus: false
    })

    // deleteDialogRef.afterClosed().subscribe((result: any) => {
    //   result == 'Yes' ? this.blockAction(obj) : '';
    // })
  }

  handleClick(res:any) {
    this.openDialog(res);
  }

  // <h2 class="fw-bold">अभिनंदन</h2>
  //           <div class="form-label">आपला आरजा यशस्वी रित्या सादर झाला आहे.</div>
  //           <div class="form-data">आरजा क्रं : MNR202306210859</div>
  //           <div class="form-data">26/06/2023 11:22:10 AM</div>
  //           <div>
  //             <a href="">आरजा डाऊनलोड करा</a>
  //           </div>
  //           <button mat-flat-button class="btn-main">OK</button>

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

 


