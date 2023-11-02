import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from 'src/app/core/services/validation.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { Router } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
// import * as CryptoJS from 'crypto-js';



@Component({
  moduleId: module.id,
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  loginForm!: FormGroup;
  loginFlag: boolean = true;
  encryptInfo: any;
  loginData: any;
  constructor(private fb: FormBuilder,
    public validation: ValidationService,
    private commonMethods: CommonMethodsService,
    private error: ErrorHandlingService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private WebStorageService : WebStorageService,
    private router: Router,
    private AESEncryptDecryptService:AesencryptDecryptService
  ) {

  }

  ngOnInit() {
    // let ele = document.getElementById('usernameId');
    // ele?.focus();
    this.defaultForm();
  }

  ngAfterViewInit(): void {
    this.commonMethods.createCaptchaCarrerPage();
  }

  defaultForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(this.validation.mobile_No),(this.validation.maxLengthValidator(30))]],
      password: ['', [Validators.required, Validators.pattern(this.validation.password)]],
      captcha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    })
  }

  get f() { return this.loginForm.controls; }

  refreshCaptcha() {
    this.commonMethods.createCaptchaCarrerPage();
    this.loginForm.controls['captcha'].setValue('');

  }

  onLoginSubmit() {
    this.loginFlag = false;
    this.spinner.show();
    if (this.loginForm.invalid) {
      this.loginFlag = true;
      this.spinner.hide();
      return
    } else if (this.loginForm.value.captcha != this.commonMethods.checkvalidateCaptcha()) {
      this.spinner.hide();
      this.refreshCaptcha()
      this.loginFlag = true;
      this.commonMethods.snackBar("Please Enter Valid Capcha", 1)
      return;
    }
    else {
      this.spinner.hide();
      let formData = this.loginForm.value;
      let obj = {
        "userName": formData.userName,
        "password": formData.password
      }
      this.apiService.setHttp('post', 'sericulture/api/Login/CheckLogin', false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.spinner.hide();
          this.commonMethods.snackBar(res.statusMessage, 0);
          sessionStorage.setItem('loggedIn', 'true');
   
          this.encryptInfo = encodeURIComponent((JSON.stringify(JSON.stringify(res))))
          // this.encryptInfo = encodeURIComponent((JSON.stringify(JSON.stringify(res)), 'secret key 123').toString());
          this.loginData = this.AESEncryptDecryptService.encrypt(JSON.stringify(res?.responseData));
          localStorage.setItem('silkDharashivUserInfo', this.loginData);
         //this.router.navigate(['/dashboard']);
          this.router.navigate([this.WebStorageService.redirectTo()]);//redirect to first page in array
        //  this.router.navigate([this.WebStorageService.redirectTo()]);//redirect to first page in array
         
          this.loginFlag = true;
        }
        else {
          this.spinner.hide();
          this.loginFlag = true;
          this.refreshCaptcha();
          this.commonMethods.snackBar(res.statusMessage, 1)
        }
      }, (error: any) => {
        this.spinner.hide();
        this.loginFlag = true;
        this.error.handelError(error.status);
      })
    }

  }
}
