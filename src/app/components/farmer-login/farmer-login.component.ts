import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-farmer-login',
  templateUrl: './farmer-login.component.html',
  styleUrls: ['./farmer-login.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, TranslateModule],

})
export class FarmerLoginComponent {
  farmerMobileNo = new FormControl('', [Validators.required, Validators.pattern(this.validation.mobile_No)]);
  otpForm!: FormGroup;
  subscription!: Subscription;
  lang: string = 'English';
  loginFlag!: boolean;
  otpTimerFlag: boolean = false;
  otpTimerCount: number | any;
  otpTimer: number = 60;
  sendOTPContainer: boolean = true;
  verifyOTPContainer: boolean = false;
  loginData: any;
  accessToken: any;
  mobNo : any;
  getLangForLocalStor!: string | null | any;

  constructor
    (
      private spinner: NgxSpinnerService,
      private WebStorageService: WebStorageService,
      private apiService: ApiService,
      private commonMethod: CommonMethodsService,
      private errorHandler: ErrorHandlingService,
      private fb: FormBuilder,
      public validation: ValidationService,
      private router: Router,private translate: TranslateService,
      private activatedRoute : ActivatedRoute,
      public encryptDecryptService: AesencryptDecryptService
    ) {
      let paramData: any = this.activatedRoute.snapshot.queryParams;
      this.mobNo = paramData?.mobNo ? this.encryptDecryptService?.decrypt(paramData?.mobNo).toString() : '';
      localStorage.getItem('language') ? this.getLangForLocalStor = localStorage.getItem('language') : localStorage.setItem('language', 'English'); this.getLangForLocalStor = localStorage.getItem('language');
      this.translate.use(this.getLangForLocalStor)
  }

  ngOnInit() {
    
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.mobNo ?  this.farmerMobileNo.setValue(this.mobNo) : '';
    this.getOtpFormData();

  }

  getOtpFormData() {
    this.otpForm = this.fb.group({
      otpA: ['', [Validators.required]],
      otpB: ['', [Validators.required]],
      otpC: ['', [Validators.required]],
      otpD: ['', [Validators.required]],
      otpE: ['', [Validators.required]]
    })
  }

  getOtpByMobileNo() {
    this.spinner.show();
    this.getOtpFormData();
    this.spinner.show();
    if (this.farmerMobileNo.invalid) {
      this.spinner.hide();
      return;
    } else {
      let obj = {
        "mobileNo": this.farmerMobileNo.value,
        "otp": "",
        "pageName": "Login",
        "createdBy": 0,
        "loginFlag": "web",
        "userType": 1
      }
      this.apiService.setHttp('post', 'sericulture/api/OtpTran/GenerateOTP?lan=' + this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.setOtpTimer();
            this.loginFlag = true;
          }
          else if (res.statusMessage == 'मोबाईल क्रमांक नोंदणीकृत नाही' || res.statusMessage == 'Mobile number is not registered' ) { 
            this.commonMethod.snackBar(res.statusMessage, 1);
            let mobNo: any = this.farmerMobileNo.value;
            this.router.navigate(['farmer-signup'], { queryParams: { mobNo: this.encryptDecryptService.encrypt(mobNo.toString()) } });
          }
          else if (res.statusMessage == 'OTP already sent, try after 1 min.'|| res.statusMessage == 'OTP आधीच पाठवला आहे, 1 मिनिटानंतर प्रयत्न करा.' ){
            this.commonMethod.snackBar(res.statusMessage, 1);
            this.loginFlag = false;
          }
          else {
            this.loginFlag = false;
            this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
          }
        }),
        error: (error: any) => {
          this.spinner.hide();
          this.errorHandler.handelError(error.status);
        }
      })
    }
  }

  getLoginDetails(id?: any) {
    this.apiService.setHttp('GET', 'sericulture/api/Login/GetLoginDetails?Id=' + id, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (!res?.responseData?.pageList.length) {
          this.commonMethod.snackBar('Please Contact To Admin', 1)
        } else {
          // this.commonMethods.snackBar(res.statusMessage, 0);
          res.responseData1  = this.accessToken;
          this.loginData = this.encryptDecryptService.encrypt(JSON.stringify(res));
          localStorage.setItem('silkDharashivUserInfo', this.loginData);
          this.router.navigate([this.WebStorageService.redirectTo()]);//redirect to first page in array
        }
      }
    })
  }

  setOtpTimer() {
    this.otpTimerFlag = false;
    this.otpTimerCount = setInterval(() => {
      --this.otpTimer;
      if (this.otpTimer == 0) {
        this.otpTimerFlag = true;
        clearInterval(this.otpTimerCount);
        this.otpTimer = 60;
        this.otpForm.reset();
      }
    }, 1000)
  }


  validateOtp() {
    this.spinner.show();
    let formData = this.otpForm.value;
    let sendOtp = formData.otpA + formData.otpB + formData.otpC + formData.otpD + formData.otpE
    if (this.otpForm.invalid) {
      this.spinner.hide();
      return;
    } else {
      this.apiService.setHttp('get', 'sericulture/api/OtpTran/VerifyOTP?MobileNo=' + this.farmerMobileNo.value + '&OTP=' + sendOtp + '&PageName=Login&CreatedBy=0&lan=' + this.lang + '&LoginFlag=web&UserType=1', false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.spinner.hide();
          this.commonMethod.snackBar(res.statusMessage, 0);
          // this.router.navigate(['farmer-signup']);
          this.accessToken = res?.responseData1;
          this.getLoginDetails(res?.responseData1.refreshToken.UserId);
          this.farmerMobileNo.reset();
          this.otpForm.reset();
        }
        else {
          this.spinner.hide();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(error.status);
      })
    }
  }

  redirectPage() {
    this.router.navigate(['/farmer-signup']);
  }


}
