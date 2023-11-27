import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/core/services/api.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
import { ValidationService } from 'src/app/core/services/validation.service';

@Component({
  selector: 'app-otp-send-receive',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, ReactiveFormsModule,MatDialogModule],
  templateUrl: './otp-send-receive.component.html',
  styleUrls: ['./otp-send-receive.component.scss']
})
export class OtpSendReceiveComponent {

  otpFormControl = new FormControl('', [Validators.required]);
  otpTimerFlag: boolean = false;
  otpTimerCount: number | any;
  otpTimer: number = 60;

  constructor(
    private commonMethods: CommonMethodsService,
    private apiService: ApiService,
    private error: ErrorHandlingService, 
    // private router: Router,
    public validator: ValidationService,
    public dialogRef: MatDialogRef<OtpSendReceiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.sendOTP();
  }

  sendOTP() {
    let obj = {
      "mobileNo": this.data.mobileNo,
      "otp": "",
      "pageName": this.data.pageName,
      "createdBy": 0
    }

    this.apiService.setHttp('post', 'sericulture/api/OtpTran/GenerateOTP', false, obj, false, 'baseUrl');
    this.apiService.getHttp().subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.setOtpTimer();
      }
      else {
        this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
      }
    }, (error: any) => {
      this.error.handelError(error.status);
    })
  }

  verifyOTP() {
    if (this.otpFormControl.invalid) {
      this.commonMethods.snackBar("Please Enter OTP", 1);
      return;
    } else {
      let obj = {
        "MobileNo": this.data.mobileNo,
        "OTP": this.otpFormControl.value,
        "PageName":  this.data.pageName,
        "CreatedBy": 0
      }

      this.apiService.setHttp('get', 'sericulture/api/OtpTran/VerifyOTP?MobileNo=' + obj.MobileNo + '&OTP=' + obj.OTP + '&PageName='+obj.PageName, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.otpFormControl.setValue('');
          this.dialogRef.close('Yes');
        }
        else {
          this.commonMethods.checkDataType(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.error.handelError(error.status);
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
        this.otpFormControl.setValue('');
      }
    }, 1000)
  }

  // getlogin() {
  //   this.router.navigate(['/login']); 
  // }
}

