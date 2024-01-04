import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import {MatIconModule} from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
//import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,CommonModule,MatIconModule,TranslateModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  hide = true;
  hide1 = true;
  hide2 = true;
  changePassForm!: FormGroup;
  lang: any;
  getLangForLocalStor!: string | null | any;
  subscription!: Subscription;
  
  @ViewChild('formDirective') private formDirective!: NgForm;
  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private fb: FormBuilder,
    public validation: ValidationService,
    private commonMethods: CommonMethodsService,
    private apiService: ApiService,
    private error: ErrorHandlingService,
    private webStorage: WebStorageService,
    private translate: TranslateService,
    //private AESEncryptDecryptService: AesencryptDecryptService,
  ) { 
    localStorage.getItem('language') ? this.getLangForLocalStor = localStorage.getItem('language') : localStorage.setItem('language', 'English'); this.getLangForLocalStor = localStorage.getItem('language');
    this.translate.use(this.getLangForLocalStor)
  }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : localStorage.getItem('language') ? localStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.defaultForm();
  }

  get f() {
    return this.changePassForm.controls;
  }

  defaultForm() {
    this.changePassForm = this.fb.group({
      currentPass: ['', [Validators.required, Validators.pattern(this.validation.password)]],
      newPass: ['', [Validators.required, Validators.pattern(this.validation.password)]],
      confirmPass: ['', [Validators.required, Validators.pattern(this.validation.password)]],
    })
  }

  onSubmit() {
    let formData = this.changePassForm.value;
    if (this.changePassForm.invalid) {
      return;
    } else if (formData.newPass !== formData.confirmPass) {
      this.commonMethods.snackBar("New Password And Comfirm Password Not Match", 1);
      return;
    } else if (formData.currentPass == formData.newPass) {
      this.commonMethods.snackBar("The Entered Old Password is the Same as the New Password", 1);
    } else {
      let obj = {
        "userId": this.webStorage.getUserId(),
        "newPassword": formData.newPass, //this.AESEncryptDecryptService.encrypt(formData.newPass),
        "currentPassword":formData.currentPass //this.AESEncryptDecryptService.encrypt(formData.currentPass)
      }

      this.apiService.setHttp('post', 'sericulture/api/Login/change-password', false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.formDirective?.resetForm();
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


  clearFormData() { // for clear Form field
    this.formDirective?.resetForm();
    this.defaultForm();
  }

  closeDialogue(){
    this.dialogRef.close();
  }
}
