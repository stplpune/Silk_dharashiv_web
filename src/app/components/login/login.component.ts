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
// import * as CryptoJS from 'crypto-js';



@Component({
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
  encryptInfo:any;
  constructor(private fb: FormBuilder,
    public validation: ValidationService,
    private commonMethods: CommonMethodsService,
    private error: ErrorHandlingService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
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
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.validation.password)]],
      captcha: ['', [Validators.required, Validators.pattern('^[0-9]{4}$'), Validators.minLength(4), Validators.maxLength(4)]]
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
      this.spinner.hide();
      return
    } else if (this.loginForm.value.captcha !=  this.commonMethods.checkvalidateCaptcha()) {
      this.spinner.hide();
      this.refreshCaptcha()
      this.commonMethods.snackBar("Please Enter Valid Capcha", 1)
      return;
    }
    else if (this.loginForm.valid) {
      this.spinner.hide();
      let loginData = this.loginForm.value;
      delete loginData.captcha;
      let obj = {
        "userName": loginData.userName,
        "password": loginData.password
      }
      this.apiService.setHttp('post', 'sericulture/api/Login/CheckLogin', false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        console.log(res);

        if (res.statusCode == "200") {
          this.spinner.hide();
          this.commonMethods.snackBar(res.statusMessage, 0);
          sessionStorage.setItem('loggedIn', 'true');
          this.encryptInfo = encodeURIComponent((JSON.stringify(JSON.stringify(res)), 'secret key 123').toString());
          localStorage.setItem('loggedInData', this.encryptInfo);
          this.commonMethods.snackBar(res.statusMessage,0);
          this.commonMethods.routerLinkRedirect('/dashboard');
          this.loginFlag=true;
        }
        else {
          this.spinner.hide();
          this.loginFlag=true;
          this.refreshCaptcha();
          this.commonMethods.snackBar(res.statusMessage, 1)
        }
      }, (error: any) => {
        this.spinner.hide();
        this.error.handelError(error.status);
      })
    }

  }
}
