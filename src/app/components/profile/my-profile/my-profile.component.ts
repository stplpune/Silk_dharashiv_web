import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent {

  pageAccessObject: object | any;
  subscription!: Subscription;//used  for lang conv
  lang: string = 'English';
  profilDetailsArr:any;
  imageRes :any
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private commonMethod: CommonMethodsService,
    private errorHandler: ErrorHandlingService,
    // private fb: FormBuilder,
    private WebStorageService: WebStorageService,
    private fileUpl : FileUploadService
  ) { }

  ngOnInit() {
    console.log("userId",this.WebStorageService.getUserId());
    
    this.WebStorageService.getAllPageName().filter((ele: any) => { return ele.pageName == 'Department' ? this.pageAccessObject = ele : '' })
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getProfileData();
  }


  getProfileData() {
    this.apiService.setHttp('get', `sericulture/api/UserRegistration/get-user-details?Id=${this.WebStorageService.getUserId()}&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {         
          this.profilDetailsArr = res.responseData.responseData1[0]
          console.log("this.profilDetailsArr",this.profilDetailsArr);
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorHandler.handelError(err.statusCode) })
    });
  }

  imageUplod(event: any) {
    this.spinner.show();
    this.fileUpl.uploadDocuments(event, 'Upload', 'png,jpg,jfif,jpeg,hevc').subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.spinner.hide();
          this.imageRes = res.responseData;
          setTimeout(() => {
            this.setProfilePhoto(); 
          }, 500);
        }
        else {
          this.imageRes = "";
        }
      }),
      error: (error: any) => {
        this.spinner.hide();
        this.commonMethod.checkDataType(error.status) == false ? this.errorHandler.handelError(error.statusCode) : this.commonMethod.snackBar(error.statusText, 1);
      }
    })
  }

  setProfilePhoto(){
    let imageObj = {      
        "id": this.WebStorageService.getUserId(),
        "imagePath":this.imageRes      
    }
    this.apiService.setHttp('put', `sericulture/api/UserRegistration/Upload-Image_web?lan=en`, false, imageObj, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == 200) {        
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.getProfileData();
        } else {
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: ((err: any) => { this.errorHandler.handelError(err.statusCode) })
    });
  }

}
