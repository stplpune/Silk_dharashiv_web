import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
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
  imports: [CommonModule,MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule,TranslateModule],
 
})
export class FarmerLoginComponent {
farmerMobileNo=new FormControl('',[Validators.required,Validators.pattern(this.validation.mobile_No)]);
otpForm!:FormGroup;
subscription!: Subscription;
lang: string = 'English';
loginFlag!:boolean;
otpTimerFlag: boolean = false;
otpTimerCount: number | any;
otpTimer: number = 60;
sendOTPContainer: boolean = true;
verifyOTPContainer: boolean = false;
  constructor
  (
    private spinner: NgxSpinnerService,
    private WebStorageService: WebStorageService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private errorHandler: ErrorHandlingService,
    private fb:FormBuilder,
    public validation: ValidationService,
    private router: Router
  ){}

  ngOnInit(){
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getOtpFormData();
  }

  getOtpFormData(){
    this.otpForm=this.fb.group({
      otpA:['',[Validators.required]],
      otpB:['', [Validators.required]],
      otpC:['', [Validators.required]],
      otpD:['', [Validators.required]],
      otpE:['', [Validators.required]]
    })
  }

  getOtpByMobileNo(){
    this.spinner.show();
    if(this.farmerMobileNo.invalid){
      this.spinner.hide();
      return;
    }else{
      let obj={
        "mobileNo": this.farmerMobileNo.value,
        "otp": "",
        "pageName": "Login",
        "createdBy":0,
        "loginFlag":"web"
      }
      this.apiService.setHttp('post', 'sericulture/api/OtpTran/GenerateOTP?lan='+this.lang, false, obj, false, 'masterUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          this.spinner.hide();
          if (res.statusCode == "200") {
            this.commonMethod.snackBar(res.statusMessage, 0);
            this.setOtpTimer();
            this.loginFlag=true;
          }
          else {
            this.loginFlag=false;
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

 
  validateOtp(){
    let formData =this.otpForm.value;
    let sendOtp=formData.otpA + formData.otpB + formData.otpC + formData.otpD + formData.otpE
    if(this.otpForm.invalid){
      this.spinner.hide();
      return;
    } else{
      this.apiService.setHttp('get', 'sericulture/api/OtpTran/VerifyOTP?MobileNo='+this.farmerMobileNo.value+'&OTP='+sendOtp+'&PageName=Login&CreatedBy=0&lan='+this.lang+'&LoginFlag=web', false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.router.navigate(['farmer-signup']);
          this.farmerMobileNo.reset();
          this.otpForm.reset();
        }
        else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {        
        this.errorHandler.handelError(error.status);
      })
    }
  }

  redirectPage(){
    this.router.navigate(['farmer-signup']);
  }
  

}
