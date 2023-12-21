import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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
import { MatStepper } from '@angular/material/stepper';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-create-manarega-app',
  templateUrl: './create-manarega-app.component.html',
  styleUrls: ['./create-manarega-app.component.scss']
})
export class CreateManaregaAppComponent {
  manaregaFrm !: FormGroup;
  manFrmSubmitFlag: boolean = false;
  farmInfoFrm !: FormGroup;
  farmDeatailsFrm !: FormGroup;
  bankInfoFrm !: FormGroup;
  documentFrm !: FormGroup;
  otherDocumentFrm !: FormGroup;
  addRegistrationRecFrm !: FormGroup;
  filterFrm !: FormGroup;
  profileImageUrl: any;
  subscription!: Subscription;//used  for lang conv
  lang: any;
  // isLinear = false;
  schemeData:any;
  viewMsgFlag: boolean = false;//used for error msg show
  genderArray: any = [{ id: 1, name: 'Male', m_name: 'पुरुष' }, { id: 2, name: 'Female', m_name: 'स्त्री  ' }];
  checkedArray: any = [{ id: true, name: 'Yes', m_name: 'होय' }, { id: false, name: 'No', m_name: 'नाही' }];
  selfTrainingArray: any = [{ id: true, name: 'Own', m_name: 'स्वत:' }, { id: false, name: 'Candidate', m_name: 'उमेदवार' }];
  displayedColumns = ['srNo', 'plantName', 'gutNo', 'gutArea', 'cultivatedArea', 'cultivatedPlantsCount', 'actions'];
  plantDisplayedColumns = ['srNo', 'plantName', 'gutNo', 'gutArea', 'cultivatedArea', 'cultivatedPlantsCount'];
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
  checkedItems: any[] = []; // Define an array to store checked items
  maxDate = new Date();
  farmDetails = new Array();
  index: any;
  farmDeatailsEditObj: any
  dataSource: any;
  EditFlag: boolean = false;
  filterDataRes: any // used for store filter data res
  @ViewChild('formDirective') private formDirective!: NgForm;
  //documnet form variable
  docUploadedPath: string = '';
  docArray = [{ id: 0, docTypeId: 12, docPath: '', docNo: '', docname: 'Job Card', isDeleted: false }, { id: 0, docTypeId: 19, docPath: '', docNo: '', docname: '8A Form', isDeleted: false }, { id: 0, docTypeId: 18, docPath: '', docNo: '', docname: '7-Dec', isDeleted: false },
  { id: 0, docTypeId: 11, docPath: '', docNo: '', docname: 'Nationalized Bank Passbook', isDeleted: false }, { id: 0, docTypeId: 8, docPath: '', docNo: '', docname: 'Registration Fee Receipt', isDeleted: false }]
  visible: boolean = false;
  otherDocArray: any = new Array();
  @ViewChild('otherDocImage') OtherDocImg!: ElementRef;
  OtherDocUploadImg = new Array();
  @ViewChild('formDirectivess') private otherformDirective!: NgForm;
  documentdisplayedColumns: string[] = ['srNo', 'documentType', 'docNo', 'action'];
  //selfDeckaration form variable
  selfDeclarationFrm !: FormGroup
  //preview form variable
  previewData: any;
  previewManarega: any;
  previewDocName: any
  routingData: any;//used for get routing data
  @ViewChild('stepper') private myStepper!: MatStepper;
  // isFormDisabled: boolean = true; //disable enable form
  // @ViewChild('myForm')form:any;
  manaregaAadhar : any;
  checkManaregaId:any

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
    private datePipe:DatePipe,
    private dateAdapter: DateAdapter<Date>,
    public encryptdecrypt: AesencryptDecryptService,
  ) { 
    this.dateAdapter.setLocale('en-GB');
    let Id: any;
    this.route.queryParams.subscribe((queryParams: any) => { Id = queryParams['id'] });
    if(Id){
      this.manaregaAadhar =  this.encryptdecrypt.decrypt(`${decodeURIComponent(Id)}`)
    }
  }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.route.queryParams.subscribe((queryParams: any) => {
      this.routingData = queryParams['id'];
    });
    this.getSchemeData();
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
    this.getPreviewData();
  }

  commonDropdown() {
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

  filterDefaultFrm() {
    this.filterFrm = this.fb.group({
      mobileNo: [''],
    })
  }

  clearForm() {
    this.addManaregaFrm();
    this.addRegistrationFrm(); this.addFarmInfo();
    this.addDocumentFrm(); this.addBankInfo();
    this.getFarmInfo(); this.filterDefaultFrm();
    this.addSelfDeclaration(); this.addOtherDocument();
    this.otherDocArray = []; this.farmDetails = [];
    this.checkedItems = []; this.previewData = [];
  }

  getSchemeData() {
    this.masterService.GetSelectSchemeData(this.WebStorageService.getMobileNo(), 1).subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200") {
          this.checkManaregaId = res.responseData;
        }
        else{
          this.checkManaregaId = [];
        }

      })
    })
  }

  //#region --------------form start here---------------------
  addManaregaFrm(data?: any) {
    this.manaregaFrm = this.fb.group({
      "id": [data?.id || 0],
      "farmerId": [this.WebStorageService.getUserId()],
      "schemeTypeId": [1],
      "applicationNo": [data?.applicationNo || ''],
      "mobileNo1": [this.WebStorageService.getMobileNo(), [Validators.required, this.validation.maxLengthValidator(10), Validators.pattern(this.validation.mobile_No)]],
      "aadharNo": [data?.aadharNo || this.manaregaAadhar, [Validators.required, this.validation.maxLengthValidator(12), Validators.pattern(this.validation.aadhar_card)]],
      // "profilePhotoPath": ['',[Validators.required]],
      "mn_DepartmentId": [data?.mn_DepartmentId || '', [Validators.required]],
      "fullName": [data?.fullName || '', [Validators.required, this.validation.minLengthValidator(5), this.validation.maxLengthValidator(100), Validators.pattern(this.validation.fullName)]],
      "m_FullName":[data?.m_FullName|| '',[Validators.required, Validators.pattern(this.validation.marathi), this.validation.maxLengthValidator(100)]], 
      "mobileNo2": [data?.mobileNo2 || '', [this.validation.maxLengthValidator(10), Validators.pattern(this.validation.mobile_No)]],
      "birthDate": [data?.birthDate || '', [Validators.required]],
      "gender": [data?.genderId || 1],//no
      "qualificationId": [data?.qualificationId || '', [Validators.required]],//no
      "stateId": [data?.stateId || (this.WebStorageService.getStateId() == '' ? '' : this.WebStorageService.getStateId())],//no
      "districtId": [data?.districtId || (this.WebStorageService.getDistrictId() == '' ? '' : this.WebStorageService.getDistrictId())],//no
      "talukaId": [data?.talukaId  ? data?.talukaId : (this.WebStorageService.getTalukaId() ? this.WebStorageService.getTalukaId()  :   '') , [Validators.required]],//no
      "grampanchayatId": [data?.grampanchayatId  ? data?.grampanchayatId : (this.WebStorageService.getGrampanchayatId() ? this.WebStorageService.getGrampanchayatId()  :   ''), [Validators.required]],//no
      "village": [data?.village || '', [this.validation.maxLengthValidator(30), Validators.pattern(this.validation.fullName)]],
      "address": [data?.address || '', [this.validation.maxLengthValidator(200), Validators.required]],//Mandetory Max:200, alphanumeric with special char
      "pinCode": [data?.pinCode || '', [Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.valPinCode)]],//Mandetory  Max: 6 digit, numeric
      "mn_JobCardNo": [data?.mn_JobCardNo || '', [Validators.required, this.validation.maxLengthValidator(30)]],//Mandetory  Max: 30 alphanumeric with sepcial char
      "categoryId": [''],//no, [Validators.required],
      "profilePhotoPath": [data?.profilePhotoPath || '', [Validators.required]]
    })
  }

  addDocumentFrm() {
    this.documentFrm = this.fb.group({
      'allRequiredDocument': ['', [Validators.required]]
    })
  }

  addRegistrationFrm() {
    this.addRegistrationRecFrm = this.fb.group({
      'registrationDocument': ['', [Validators.required]]
    })
  }

  addFarmInfo(data?: any) {
    this.farmInfoFrm = this.fb.group({
      "benificiaryTotalFarm": [data?.benificiaryTotalFarm || '', [Validators.required, this.validation.maxLengthValidator(4), Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]], //Mandetory  Hectory हेक्टर - Max: 4 digit, float  
      "mulberryCultivatedSurveyNo": [data?.mulberryCultivatedSurveyNo || '', [Validators.required, this.validation.maxLengthValidator(6), Validators.pattern(this.validation.onlyNumbers)]],//Mandetory  Max: 6 digit, numeric
      "cultivatedFarmInHector": [data?.cultivatedFarmInHector || '', [Validators.required, this.validation.maxLengthValidator(4), Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]],//num  // Mandetory Hectory हेक्टर - Max: 4 digit, numeric
      "isJointAccHolder": [data?.isJointAccHolder || false],//true //Default - No
      "applicantFarmSurveyNo": [data?.applicantFarmSurveyNo || ''],//19 A Mandetory 4 digit, numeric
      "applicantFarmArea": [data?.applicantFarmArea || ''],//num   19 B Mandetory Hectory हेक्टर - Max: 4 digit, float
      "farmTypeId": [data?.farmTypeId || '', [Validators.required]],//num Mandetory
      "irrigationFacilityId": [data?.irrigationFacilityId || '', [Validators.required]],//num Mandetory
      "isAnyPlantedBeforeGovScheme": [data?.isAnyPlantedBeforeGovScheme || false],//true  //Default - No
      "isAnyPlantedBeforeGovSchemeArray": [''],
      "isSelfTraining": [data?.isSelfTraining || false],//true //Default - Own   Own स्वतः Candidate उमेदवार
      "candidateName": [data?.candidateName || ''],//Mandetory  Max: 50, Alphabetic 
      "candidateRelationId": [data?.candidateRelationId || ''],//num  Mandetory
    })
  }

  addBankInfo(data?: any) {
    this.bankInfoFrm = this.fb.group({
      "bankId": [data?.bankId || '', [Validators.required]],//num
      "bankBranchId": [data?.bankBranchId || '', [Validators.required]],//num
      "bankIFSCCode": [data?.bankIFSCCode || '', [Validators.required, this.validation.maxLengthValidator(11), Validators.pattern(this.validation.bankIFSCCodeVal)]],
      "bankAccountNo": [data?.bankAccountNo || '', [Validators.required, this.validation.maxLengthValidator(30), Validators.pattern(this.validation.onlyNumbers)]]
    })
  }

  addOtherDocument() {
    this.otherDocumentFrm = this.fb.group({
      "id": [0],
      "docNo": [''],
      "docname": [''],
      "docPath": ['']
    })
  }

  addSelfDeclaration(res?: any) {
    this.selfDeclarationFrm = this.fb.group({
      "isHonestLabor": [res?.isHonestLabor || false, [Validators.required]],
      "isSelfTransport": [res?.isSelfTransport || false, [Validators.required]],
      "isEligibleGettingInstallmentAmount": [res?.isEligibleGettingInstallmentAmount || false, [Validators.required]],
      "isBoundByConditions": [res?.isBoundByConditions || false, [Validators.required]],
      "isPayMoreThanLimitedAmt": [res?.isPayMoreThanLimitedAmt || false, [Validators.required]],
      "isSignedOnLetter": [res?.isSignedOnLetter || false, [Validators.required]],
      "isChangedAcceptable": [res?.isChangedAcceptable || false, [Validators.required]],
      "isSchemeCorrectAsPerSatbara": [res?.isSchemeCorrectAsPerSatbara || false, [Validators.required]],
      "isJointAccHolderTermAcceptable": [res?.isJointAccHolderTermAcceptable || false, [Validators.required]],
      "checkValue": ['', Validators.required]
    })
  }

  get f() {
    return this.manaregaFrm.controls
  }

  //#endregion--------------------form end here------------------------------------------ 
  //#region  -----------------------------------------------------------doc upload section fn start heare-----------------------------------//

  fileUpload(event: any, docId: any, lable: any) {
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray, 'docTypeId', docId);
    this.spinner.show();
    let type = lable == 'profilePhoto' ? 'jpg, jpeg, png' : 'jpg, jpeg, png, pdf';
    this.fileUpl.uploadDocuments(event, 'ApplicationDocuments', type, '', '', this.lang).subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {
          this.spinner.hide();
          lable == 'documents' ? this.docArray[indexByDocId].docPath = res.responseData : lable == 'profilePhoto' ? this.manaregaFrm.controls['profilePhotoPath'].setValue(res.responseData) :
            (this.otherDocumentFrm.controls['docPath'].setValue(res.responseData));//lable == 'otherDocuments'
          // ,this.docArray[indexByDocId].docTypeId = 7
        }
        //this.commonMethod.snackBar(res.statusMessage, 0)
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
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.docArray, 'docTypeId', docId);
    this.docArray[indexByDocId]['docPath'] = '';
  }
  //#endregion  --------------------------------------------------------doc upload section fn end here-----------------------------------//
  viewPreviewDocument(docId: any) {//preview document
    let indexByDocId = this.commonMethod.findIndexOfArrayObject(this.previewData?.documents, 'docId', docId);
    this.previewDocName = this.previewData?.documents[indexByDocId].documentName;
    console.log("docName docName docName", this.previewDocName)
    let obj = this.previewData?.documents[indexByDocId].documentPath;
    window.open(obj, '_blank')
  }
  getDocumentsWithDocId7() {  //preview other docment
    return this.previewData?.documents.filter((doc: any) => doc.docId === 7);
  }

  //#region -----------------other document upload functionality start --------------------------------------------------
  onOtherDocSubmit() {
    let uploadFrmValue = this.otherDocumentFrm.getRawValue();
    if (!uploadFrmValue?.docname) {
      this.commonMethod.snackBar((this.lang == 'en' ? 'Document name is  required' : 'दस्तऐवजाचे नाव आवश्यक आहे'), 1);
      return
    } else if (!uploadFrmValue?.docNo) {
      this.commonMethod.snackBar((this.lang == 'en' ? 'Document number is  required' : 'दस्तऐवज क्रमांक आवश्यक आहे'), 1);
      return
    } else if (!uploadFrmValue?.docPath) {
      this.commonMethod.snackBar((this.lang == 'en' ? 'Document path is  required' : 'दस्तऐवज मार्ग आवश्यक आहे'), 1);
      return
    }
    else {
      let obj = {
        "id": 0,
        "applicationId": this.manaregaFrm.getRawValue()?.id || 0,//remove 0
        "docTypeId": 7,
        "docNo": uploadFrmValue.docNo,
        "docname": uploadFrmValue.docname,
        "docPath": uploadFrmValue.docPath,
        "createdBy": this.WebStorageService.getUserId(),
        "isDeleted": false
      }

      if (!this.OtherDocUploadImg.length) {
        this.OtherDocUploadImg.push(obj);
        //this.commonMethod.snackBar((this.lang == 'en' ? "Document added successfully" : "दस्तऐवज यशस्वीरित्या जोडला गेला"), 0)
        //reset form code remainingresetForm();
      }
      else {
        let existedName = this.OtherDocUploadImg.find((res: any) => res.docname == uploadFrmValue.docname);
        if (existedName) { this.commonMethod.snackBar((this.lang == 'en' ? "Document Name Already exist" : "दस्तऐवजाचे नाव आधीपासून अस्तित्वात आहे."), 1); return; }
        else {
          this.OtherDocUploadImg.push(obj);
        }
      }
      this.otherDocArray = new MatTableDataSource(this.OtherDocUploadImg);
      this.resetOtherDocForm();
    }
  }
  deleteOtherDocument() {
    this.OtherDocImg.nativeElement.value = '';
    this.otherDocumentFrm.controls['docPath'].setValue('');
  }
  resetOtherDocForm() {
    this.otherformDirective.resetForm();
    this.OtherDocImg.nativeElement.value = "";
  }

  deleteTableOtherDocument(i: any, element: any) { //logic for delete table document
    // this.OtherDocUploadImg.splice(i,1)
    element.id == 0 ? this.OtherDocUploadImg.splice(i, 1) : this.OtherDocUploadImg[i].isDeleted = true;
    let otherDoc: any = [];
    this.OtherDocUploadImg.find((ele: any) => {
      if (ele.isDeleted) {
      } else {
        otherDoc.push(ele);
      }
    })
    this.otherDocArray = new MatTableDataSource(otherDoc);
  }
  //#endregion  --------------------------------------------------------other doc upload section fn end here-----------------------------------//
  //#region -------------------------------on radio button click add remove validation fn start------------------------------------------------
  onClickAccountHolder(val: any) {
    if (val == true) {
      this.farmInfoFrm.controls['applicantFarmSurveyNo'].setValidators([Validators.required, this.validation.maxLengthValidator(4), Validators.pattern(this.validation.onlyNumbers)]);
      this.farmInfoFrm.controls['applicantFarmArea'].setValidators([Validators.required, this.validation.maxLengthValidator(4), Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]);
    } else {
      this.farmInfoFrm.controls['applicantFarmSurveyNo'].clearValidators();
      this.farmInfoFrm.controls['applicantFarmArea'].clearValidators();
    }
    this.farmInfoFrm.controls['applicantFarmSurveyNo'].updateValueAndValidity();
    this.farmInfoFrm.controls['applicantFarmArea'].updateValueAndValidity();
  }

  onClickPlantedBeforeGovScheme(val: any) {
    if (val) {
      this.farmDeatailsFrm.controls['plantName'].setValidators([this.validation.maxLengthValidator(50), Validators.pattern(this.validation.alphaNumericWithSpace)]);
      this.farmDeatailsFrm.controls['gutNo'].setValidators([this.validation.maxLengthValidator(6), Validators.pattern(this.validation.onlyNumbers)]);
      this.farmDeatailsFrm.controls['gutArea'].setValidators([this.validation.maxLengthValidator(6), Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]);
      this.farmDeatailsFrm.controls['cultivatedArea'].setValidators([this.validation.maxLengthValidator(10), Validators.pattern(this.validation.numericWithdecimaluptotwoDigits)]);
      this.farmDeatailsFrm.controls['cultivatedPlantsCount'].setValidators([this.validation.maxLengthValidator(6), Validators.pattern(this.validation.onlyNumbers)]);
    } else {
      this.farmDeatailsFrm.controls['plantName'].clearValidators();
      this.farmDeatailsFrm.controls['gutNo'].clearValidators();
      this.farmDeatailsFrm.controls['gutArea'].clearValidators();
      this.farmDeatailsFrm.controls['cultivatedArea'].clearValidators();
      this.farmDeatailsFrm.controls['cultivatedPlantsCount'].clearValidators();
      this.farmDetails = [];
      this.dataSource = new MatTableDataSource(this.farmDetails);
    }
    this.farmDeatailsFrm.controls['plantName'].updateValueAndValidity();
    this.farmDeatailsFrm.controls['gutNo'].updateValueAndValidity();
    this.farmDeatailsFrm.controls['gutArea'].updateValueAndValidity();
    this.farmDeatailsFrm.controls['cultivatedArea'].updateValueAndValidity();
    this.farmDeatailsFrm.controls['cultivatedPlantsCount'].updateValueAndValidity();
  }

  onClickSelfTraining(val: any) {
    if (val == false) {
      this.farmInfoFrm.controls['candidateName'].setValidators([Validators.required, this.validation.maxLengthValidator(50), Validators.pattern(this.validation.alphabetWithSpace)]);
      this.farmInfoFrm.controls['candidateRelationId'].setValidators([Validators.required]);
    } else {
      this.farmInfoFrm.controls['candidateName'].clearValidators();
      this.farmInfoFrm.controls['candidateRelationId'].clearValidators();
    }
    this.farmInfoFrm.controls['candidateName'].updateValueAndValidity();
    this.farmInfoFrm.controls['candidateRelationId'].updateValueAndValidity();
  }
  //#endregion-----------------------on radio button click add remove validation fn start-------------------

  FarmValidations(key: any) {
    if (key == 'cultivatedFarmInHector') {
      if (this.farmInfoFrm.getRawValue()?.cultivatedFarmInHector > this.farmInfoFrm.getRawValue()?.benificiaryTotalFarm) {
           this.farmInfoFrm.controls['cultivatedFarmInHector'].setValue('');
      }
    }
    else if (key == 'applicantFarmArea') {
      if (this.farmInfoFrm.getRawValue()?.applicantFarmArea > this.farmInfoFrm.getRawValue()?.benificiaryTotalFarm) {
        // this.commonMethod.snackBar((this.lang == 'en' ? "Should not greater than point no. 16" : "मुद्धा क्रमांक १६ पेक्षा मोठा नसावा"), 1);
        this.farmInfoFrm.controls['applicantFarmArea'].setValue('');
      }
      else if (this.farmInfoFrm.getRawValue()?.cultivatedFarmInHector > this.farmInfoFrm.getRawValue()?.applicantFarmArea) {
        //this.commonMethod.snackBar((this.lang == 'en' ? "Not less than point no. 18" : "मुद्धा क्रमांक १८ पेक्षा कमी नसावा"), 1);
        this.farmInfoFrm.controls['applicantFarmArea'].setValue('');
      }
    }
    else if (key == 'cultivatedArea') {
      if (this.farmDeatailsFrm.getRawValue()?.cultivatedArea > this.farmDeatailsFrm.getRawValue()?.gutArea) {
        //this.commonMethod.snackBar((this.lang == 'en' ? "Should not greater than point no. 16" : "मुद्धा क्रमांक १६ पेक्षा मोठा नसावा"), 1);
        this.farmDeatailsFrm.controls['cultivatedArea'].setValue('');
      }
    }
  }

  //-----------------------------------

  getFarmInfo() {
    this.farmDeatailsFrm = this.fb.group({
      "id": [0],
      "plantName": [''],//Max 50, Alphanumeric
      "gutNo": [''],//6 digit, numeric
      "gutArea": [''],//6 digit, Float
      "cultivatedArea": [''],//10 digit, Float
      "cultivatedPlantsCount": [''] //Max 4 digit, Numeric
    })
  }
  onAddFarmInfo() {
    //this.onClickPlantedBeforeGovScheme(true);
    let data = this.farmDeatailsFrm.getRawValue();
    if (!data?.plantName) {
      this.commonMethod.snackBar((this.lang == 'en' ? 'Please enter orchard/flower/tree Name' : 'कृपया फळबाग/फुलपिके/वृक्ष नाव प्रविष्ट करा'), 1);
      return
    } else if (!data?.gutNo) {
      this.commonMethod.snackBar((this.lang == 'en' ? 'Please enter group no.' : 'कृपया गट क्र. प्रविष्ट करा'), 1);
      return
    } else if (!data?.gutArea) {
      this.commonMethod.snackBar((this.lang == 'en' ? 'Please enter group area' : 'कृपया गट क्षेत्र प्रविष्ट करा'), 1);
      return
    }
    else if (!data?.cultivatedArea) {
      this.commonMethod.snackBar((this.lang == 'en' ? 'Please enter cultivated area' : 'कृपया लागवड केलेले क्षेत्र प्रविष्ट करा'), 1);
      return
    } else if (!data?.cultivatedPlantsCount) {
      this.commonMethod.snackBar((this.lang == 'en' ? 'Please enter number of trees planted' : 'कृपया लागवड केलेल्या झाडांची संख्या प्रविष्ट करा'), 1);
      return
    }

    else if (this.farmDeatailsFrm.invalid) {
      return;
    }
    else {
      let obj = {
        "id": 0,
        "applicationId": this.manaregaFrm.getRawValue()?.id,
        "plantName": data.plantName,
        "gutNo": Number(data.gutNo),
        "gutArea": Number(data.gutArea),
        "cultivatedArea": Number(data.cultivatedArea),
        "cultivatedPlantsCount": Number(data.cultivatedPlantsCount),
        "createdBy": this.WebStorageService.getUserId(),
        "isDeleted": false
      }

      if (!this.farmDetails.length) {
        this.farmDetails.push(obj);
        // this.commonMethod.snackBar("Data added successfully", 0)
      }
      else {
        let existedName = this.farmDetails.find((res: any) => res.plantName == data.plantName);
        if (existedName) {
          this.commonMethod.snackBar((this.lang == 'en' ? "orchard/flower/tree Name Already exist" : 'फळबाग/फुलपिके/वृक्ष नाव आधीच अस्तित्वात आहे'), 1)
          return
        }
        else {
          this.farmDetails.push(obj);
        }
      }
      this.dataSource = new MatTableDataSource(this.farmDetails);
      //this.onClickPlantedBeforeGovScheme(false);
      this.formDirective?.resetForm();
    }
  }

  deleteFarmInfo(i: number) {
    this.farmDetails[i].id != 0 ? this.farmDetails[i].isDeleted = true : this.farmDetails.splice(i, 1);
    let arrayFarmDetails: any = [];
    this.farmDetails.find((ele: any) => {
      ele.isDeleted ? '' : arrayFarmDetails.push(ele)
    })
    this.dataSource = new MatTableDataSource(arrayFarmDetails);
  }

  getPreviewData() {
   let manaregaFormValue = this.manaregaFrm.getRawValue();
   let addharNo = manaregaFormValue.aadharNo
   let mobileNo = this.WebStorageService.getMobileNo();

    if (this.filterFrm.invalid) {
      this.commonMethod.snackBar(this.lang == "en" ? "Please Enter Correct Details" : "कृपया योग्य तपशील प्रविष्ट करा", 1)
      return
    } else {
        this.apiService.setHttp('get', `sericulture/api/Application/application-preview?AadharNo=${addharNo || ''}&MobileNo=${mobileNo || ''}&lan=${this.lang}`, false, false, false, 'masterUrl');
       this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.previewData = res.responseData;
            this.onEdit(this.previewData);
            let documentArray = new Array()
            documentArray = res.responseData?.documents;

            documentArray.map((document: any) => {
              if (document.docId == 12) {
                this.previewManarega?.push(document);
              }
            });
          }
          else if (res.statusCode == "500") {
            this.clearForm();
            // this.commonMethod.snackBar(this.lang == "en" ? "No data found" : "माहिती आढळली नाही", 1)
            this.EditFlag = false
          }
          else {
            this.previewData = [];
          }
        })
      })
    }
  }


  onEdit(data?: any) {
    this.EditFlag = true;
    this.addManaregaFrm(data);
    this.addFarmInfo(data);
    this.checkedItems = data.categoryOfBeneficiaries;

    this.categoryArray.map((ele: any) => {
      this.checkedItems.find((item: any) => {
        if (ele.id == item.id) {
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
    // this.getBankBranch();
    this.farmDetails = data.plantingDetails;
    this.dataSource = new MatTableDataSource(this.farmDetails);
    data.documents.find((item: any) => {
      this.docArray.find((ele: any, i: any) => {
        if (ele.docTypeId == item.docId) {
          this.docArray[i].id = item.id
          this.docArray[i].docPath = item.documentPath
        } else {
          if (item.docId == 7) { // 7 is other doc
            let checkValue = this.OtherDocUploadImg.some((ele: any) => ele.id == item.id);
            let obj = {
              "id": item?.id,
              "applicationId": item?.id,
              "docTypeId": item?.docId,
              "docNo": item?.docNo,
              "docname": item?.documentName,
              "docPath": item?.documentPath,
              "isDeleted": false
            }
            !checkValue ? this.OtherDocUploadImg.push(obj) : '';
          }
        }
      })
    })
    // this.OtherDocUploadImg.length ? this.visible = true : this.visible = false;
    this.otherDocArray = new MatTableDataSource(this.OtherDocUploadImg);
    this.addSelfDeclaration(data);
      if (this.docArray[0].docPath && this.docArray[1]&& this.docArray[3].docPath) {
        this.documentFrm.controls['allRequiredDocument'].setValue(1);
      }
  }

  manaregaFrmVal(flag: string) {
    if (flag == 'checkedcategory') {
      let checkedcategory = this.categoryArray.some((ele: any) => ele.checked);
      if (!checkedcategory) {
        this.manaregaFrm.controls['categoryId'].setValidators([Validators.required]);
        this.manaregaFrm.controls['categoryId'].updateValueAndValidity();
      } else {
        this.manaregaFrm.controls['categoryId'].setValidators([]);
        this.manaregaFrm.controls['categoryId'].updateValueAndValidity();
      }
    }
  }

  checkStepCon(stepper: MatStepper, lable: string) {
   // console.log("this.documentFrm.invalid",this.documentFrm.controls);
   
    if (lable == 'farmerInfo' && this.manaregaFrm.invalid) {
      !this.manaregaFrm.getRawValue().profilePhotoPath ? this.manFrmSubmitFlag = true : this.manFrmSubmitFlag = false;
      return
    }

    else if (lable == 'farmerInfo' && this.manaregaFrm.valid) {
      this.onSubmit(stepper, lable);
    }
     else if (lable == 'farmInfo' && this.farmInfoFrm.valid) {
      if (this.farmInfoFrm.getRawValue().isAnyPlantedBeforeGovScheme && !this.farmDetails.length) {
        this.commonMethod.snackBar((this.lang == 'en' ? "Please enter orchard/flower/tree Name details " : "कृपया बाग/फुल/झाडाचे नाव तपशील प्रविष्ट करा"), 1)
        return
      } else {
        this.onSubmit(stepper, lable);
      }

    } else if (lable == 'bankInfo' && this.bankInfoFrm.valid) {
      this.onSubmit(stepper, lable);
    } else if (lable == 'document' && this.documentFrm.invalid) {
      for (let i = 0; i < this.docArray.length; i++) { //check all doc path
        if (this.docArray[i].docTypeId != 18 && this.docArray[i].docTypeId != 8 && this.docArray[i].docPath == '') {
          this.docArray[i].docTypeId == 12 ? this.commonMethod.snackBar((this.lang == 'en' ? 'Manrega Job Card Required' : 'मनरेगा जॉब कार्ड आवश्यक'), 1) : this.docArray[i].docTypeId == 19 ? this.commonMethod.snackBar((this.lang == 'en' ? '8 A track of Land Required' : 'जमिनीचा 8-अ आवश्यक'), 1) : this.docArray[i].docTypeId == 11 ? this.commonMethod.snackBar((this.lang == 'en' ? 'Bank Passbook / Cancelled Cheque Required' : 'पासबुक / रद्द केलेला चेक आवश्यक'), 1) : '';
          return
        }
      }
      this.documentFrm.controls['allRequiredDocument'].setValue(1)
      this.documentFrm.getRawValue().allRequiredDocument ? this.onSubmit(stepper, lable) : '';

    } else if (lable == 'document' && this.documentFrm.valid) {
      this.onSubmit(stepper, lable);
    } else if (lable == 'selfDeclaration' && this.selfDeclarationFrm.valid) {
      this.onSubmit(stepper, lable);
    } else if (lable == 'selfDeclaration' && this.selfDeclarationFrm.invalid) {
      let elfDeclarationFrmVal: any = this.selfDeclarationFrm.getRawValue();
      delete elfDeclarationFrmVal.checkValue;
      let val = Object.values(elfDeclarationFrmVal).every(item => item == true)
      if (!val) {
        this.selfDeclarationFrm.controls['checkValue'].setValue('');
        this.commonMethod.snackBar((this.lang == 'en' ? "Please select all checkboxes" : "कृपया सर्व चेकबॉक्स निवडा"), 1)

        return
      } else {
        this.selfDeclarationFrm.controls['checkValue'].setValue(true);
        this.onSubmit(stepper, lable);
      }
    } else if (lable == 'preview') {
      this.goForward(stepper);
    }
    else if (lable == 'challan' && this.addRegistrationRecFrm.invalid) {
      let findIndex = this.docArray.findIndex((ele: any) => ele.docTypeId == 8) //find index
      if (!this.docArray[findIndex].docPath) {
        this.commonMethod.snackBar((this.lang == 'en' ? 'Registration Fee Receipt Required' : 'नोंदणी फी पावती आवश्यक'), 1);
        return;
      }
      this.onSubmit(stepper, lable);
    }

    else if (lable == 'challan' && this.addRegistrationRecFrm.valid) {
      this.onSubmit(stepper, lable);
    }
  }

  checkEveryFunction(array: any, val: any) {
    return array.every((item: any) => item == val)
  }

  onSubmit(stepper: any, flag?: any) {
    this.spinner.show();
    let val = Object.values(this.selfDeclarationFrm.getRawValue()).every(item => item == true)
    !val ? this.selfDeclarationFrm.controls['checkValue'].setValue('') : this.selfDeclarationFrm.controls['checkValue'].setValue(true);

    // this.manFrmSubmitFlag = true;
    let formData = this.manaregaFrm?.getRawValue();
    let farmInfo = this.farmInfoFrm.getRawValue();
    let bankInfo = this.bankInfoFrm.getRawValue();
    let declarationInfo = this.selfDeclarationFrm.getRawValue();
    let mergeDocumentArray = [...this.docArray, ...this.OtherDocUploadImg];
    let filterByDoc = mergeDocumentArray.filter((ele: any) => ele.docPath);

    !bankInfo.bankId ? bankInfo.bankId = 0 : '';
    !bankInfo.bankBranchId ? bankInfo.bankBranchId = 0 : '';
    this.docArray.map((ele: any) => {
      ele.createdBy = this.WebStorageService.getUserId();
      ele.applicationId = formData.id;
    })
    let obj = {
      ...formData, ...declarationInfo, ...bankInfo,
      "m_Address": "",
      "sm_VoterRegistrationNo": "string",
      "sm_IsBelowPovertyLine": true,
      "benificiaryTotalFarm": Number(farmInfo.benificiaryTotalFarm) || 0,
      "sm_LandTenureCategories": 0,
      "mulberryCultivatedSurveyNo": farmInfo.mulberryCultivatedSurveyNo,
      "cultivatedFarmInHector": Number(farmInfo.cultivatedFarmInHector),
      "isJointAccHolder": farmInfo.isJointAccHolder || false,
      "applicantFarmSurveyNo": farmInfo.applicantFarmSurveyNo,
      "applicantFarmArea": Number(farmInfo.applicantFarmArea),
      "farmTypeId": Number(farmInfo.farmTypeId),
      "irrigationFacilityId": Number(farmInfo.irrigationFacilityId),
      "sm_IrrigationPeriod": 0,
      "isAnyPlantedBeforeGovScheme": farmInfo.isAnyPlantedBeforeGovScheme || false,
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
      "candidateRelationId": Number(farmInfo.candidateRelationId),
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
      "flag": (flag == 'farmerInfo' && !this.EditFlag) ? 0 : (flag == 'farmerInfo' && this.EditFlag) ? 1 : flag == 'farmInfo' ? 2 : flag == 'bankInfo' ? 3 : flag == 'document' ? 4 : flag == 'selfDeclaration' ? 5 : flag == 'challan' ? 7 : '',
      "isUpdate": true,
      "appDoc": filterByDoc,
      // "appDoc": [],
      "categoryId": this.checkedItems.map((x: any) => { return x.id }),
      //"categoryId":
      "plantingDetails": this.farmDetails,
      "internalSchemes": [],
      "currentProducts": []
    }
    this.apiService.setHttp('post', 'sericulture/api/Application/Insert-Update-Application?lan=' + this.lang, false, obj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == "200") {
          this.goForward(stepper);
          this.OtherDocUploadImg = [];
          this.getPreviewData()
          this.manaregaFrm?.controls['id'].setValue(res.responseData);
          res.responseData && flag == 'challan' ? this.openDialog(res) : '';
          this.manFrmSubmitFlag = false;
          //this.EditFlag = false;
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


  // ---------------Dropdown bind functionality start here--------------------
  searchDataZone() {
    this.talukaCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.talukaArray, this.talukaCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.talukaSubject) });
    this.gramPCtrl.valueChanges.pipe().subscribe(() => { this.commonMethod.filterArrayDataZone(this.grampanchayatArray, this.gramPCtrl, this.lang == 'en' ? 'textEnglish' : 'textMarathi', this.gramPSubject) });
  }

  getDepartment() {
    this.departmentArray = [];
    this.masterService.GetDepartmentDropdownNew().subscribe({
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
    this.bankArray = [];
    this.masterService.GetBank().subscribe({
      next: ((res: any) => {
        if (res.statusCode == "200" && res.responseData?.length) {
          this.bankArray = res.responseData;
          this.EditFlag ? (this.bankInfoFrm.controls['bankId'].setValue(this.previewData?.bankId == 0 ? '' : this.previewData?.bankId), this.getBankBranch()) : '';
        }
        else {
          this.bankArray = [];
        }
      })
    })
  }

  getBankBranch() {
    this.branchArray = [];
    let bankId = this.bankInfoFrm.getRawValue()?.bankId;
    if (bankId != 0) {
      this.masterService.GetBankBranch(bankId).subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200" && res.responseData?.length) {
            this.branchArray = res.responseData;
            this.EditFlag ? this.bankInfoFrm.controls['bankBranchId'].setValue(this.previewData?.bankBranchId == 0 ? '' : this.previewData?.bankBranchId) : '';
          }
          else {
            this.branchArray = [];
          }
        })
      })
    }
  }


  getQualification() {
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
          this.EditFlag ? (this.f['stateId'].setValue(this.previewData?.stateId), this.getDisrict()) : this.getDisrict();
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
            this.EditFlag ? (this.f['districtId'].setValue(this.previewData?.districtId), this.getTaluka()) : this.getTaluka();
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
            this.WebStorageService.getTalukaId() ? (this.f['talukaId'].setValue(this.WebStorageService.getTalukaId()),this.getGrampanchayat()) :  this.getGrampanchayat();
            this.EditFlag ? (this.f['talukaId'].setValue(this.previewData.talukaId), this.getGrampanchayat()) : this.getGrampanchayat();
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
            this.WebStorageService.getGrampanchayatId() ? this.f['grampanchayatId'].setValue(this.WebStorageService.getGrampanchayatId()):  '';
     
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

  getFarmType() {
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

  getCandidateRelation() {
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
          this.categoryArray.map((ele: any) => { ele.checked = false });
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
        });
        this.manaregaFrmVal('checkedcategory')
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

  openDialog(res?: any) {
    let dialoObj = {
      header: this.lang == 'mr-IN' ? 'अभिनंदन ' : 'Congratulations',
      title: this.lang == 'mr-IN' ? 'आपला अर्ज यशस्वीरीत्या सादर झाला आहे .' : 'Your application has been successfully submitted.',
      title2: this.lang == 'mr-IN' ? 'अर्ज क्रमांक  : ' + res.responseData1+' '+this.datePipe.transform(res.responseData2,'dd/MM/yyyy hh:mm') : 'Application no: ' + res.responseData1+' '+this.datePipe.transform(res.responseData2,'dd/MM/yyyy hh:mm'),
      cancelButton: '',
      okButton: this.lang == 'mr-IN' ? 'ओके' : 'Ok',
      headerImage: 'assets/images/check.svg'
    }
    let dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '400px',
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
    let formValue = this.manaregaFrm.getRawValue();
    if (formValue.mobileNo1 == formValue.mobileNo2) {
      this.f['mobileNo2'].setValue('');
      this.lang == 'en' ?this.commonMethod.snackBar("This mobile no. already exisit", 1) :this.commonMethod.snackBar("हा मोबाईल क्र. आधिपासूनच अस्तित्वात आहे", 1)
      }
   }

}