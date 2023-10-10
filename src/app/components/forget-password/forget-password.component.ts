import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  sendOTPContainer: boolean = true;
  verifyOTPContainer: boolean = false;
  changePassContainer: boolean = false;
  hide: boolean = true;
  hide1: boolean = true;
  verifyOTPForm!: FormGroup;
  sendOTPForm!: FormGroup;
  changePasswordfrm!: FormGroup;
  timeLeft: number = 30;
  interval: any;
  public timerFlag: boolean = true;

  constructor(private fb: FormBuilder, public validation: ValidationService,
    private commonMethods: CommonMethodsService,
    private apiService: ApiService,
    private error: ErrorHandlingService,
    private commomMethod: CommonMethodsService,
    private router: Router
   ) { }

  ngOnInit() {
    this.defaultSendOTPFrom();
    this.defaultverifyOTPForm();
    this.defaultchangepassword();
  }

  defaultSendOTPFrom() {
    this.sendOTPForm = this.fb.group({
      mobileno: ['', [Validators.required, Validators.pattern(this.validation.mobile_No)]]
    })
  }

  defaultverifyOTPForm() {
    this.verifyOTPForm = this.fb.group({
      otpA: ['', [Validators.required]],
      otpB: ['', [Validators.required]],
      otpC: ['', [Validators.required]],
      otpD: ['', [Validators.required]],
      otpE: ['', [Validators.required]],
    })
  }

  defaultchangepassword() {
    this.changePasswordfrm = this.fb.group({
      newpassword: ['', [Validators.required, Validators.pattern(this.validation.password)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.validation.password)]],
    })
  }


  sendOTP() {
    if (this.sendOTPForm.invalid) {
      this.commonMethods.snackBar("Please Enter Valid Mobile Number", 1);
      return
    } else {
      let formData = this.sendOTPForm.getRawValue();
      let obj = {
        "mobileNo": formData.mobileno,
        "otp": "",
        "pageName": "forgotpassword",
        "createdBy": 0
      }
      console.log(this.sendOTPForm.value);
      this.apiService.setHttp('post', 'sericulture/api/Login/GenerateOTPtoforgotpassword', false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        console.log(res);

        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.sendOTPContainer = false;
          this.verifyOTPContainer = true;
          this.startTimer();
        }
        else {
          this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.error.handelError(error.status);
      })
    }
  }


  verifyOTP() {
    let formData = this.sendOTPForm.getRawValue();
    let otp = this.verifyOTPForm.value.otpA + this.verifyOTPForm.value.otpB + this.verifyOTPForm.value.otpC +
      this.verifyOTPForm.value.otpD + this.verifyOTPForm.value.otpE
   
      if (this.verifyOTPForm.invalid) {
        return;
      }
      console.log(this.verifyOTPForm.value);
      
      let obj = {
      "MobileNo": formData.mobileno,
      "OTP": otp,
      "PageName": "forgotpassword",
      "CreatedBy": 0
    }

    this.apiService.setHttp('get', 'sericulture/api/OtpTran/VerifyOTP?MobileNo=' + obj.MobileNo + '&OTP=' + obj.OTP + '&PageName=forgotpassword', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      console.log(res);

      if (res.statusCode == "200") {
        this.commonMethods.snackBar(res.statusMessage, 0);
        this.verifyOTPForm.reset();
        this.verifyOTPContainer = false;
        this.changePassContainer = true
      }
      else {
        this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.error.handelError(error.status);
    })
  }

  startTimer() {
    this.timeLeft = 30;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timerFlag = false;
      } else {
        this.timerFlag = true;
        clearInterval(this.interval);
      }
    }, 1000)
  }

  ChangePassword() {
    debugger
    let formData = this.changePasswordfrm.value
    let mobiledata=this.sendOTPForm.value;
    if (this.changePasswordfrm.invalid) {
      return;
    } else if (formData.newpassword != formData.confirmPassword) {
      this.commomMethod.snackBar('New password and confirm password does not match', 1);
      return;
    }
    console.log(this.changePasswordfrm.value);
    let obj={
      "NewPassword": formData.newpassword,
      "MobileNo": mobiledata.mobileno,
     
    }
    
    this.apiService.setHttp('put', 'sericulture/api/Login/ForgotPassword?NewPassword='+obj.NewPassword+'&MobileNo='+obj.MobileNo, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.commonMethods.snackBar(res.statusMessage, 0);
        this.router.navigate(['/login']);
      }
      else {
        this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.error.handelError(error.status);
    })
  }
    


  }







