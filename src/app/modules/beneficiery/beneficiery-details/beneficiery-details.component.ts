import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-beneficiery-details',
  templateUrl: './beneficiery-details.component.html',
  styleUrls: ['./beneficiery-details.component.scss']
})
export class BeneficieryDetailsComponent {
  subscription!: Subscription;
  lang: string = 'English';
  profileData: any;
  beneficieryId: any;
  routingData: any;
  constructor
    (
      private apiService: ApiService,
      private spinner: NgxSpinnerService,
      private errorService: ErrorHandlingService,
      public webStorage: WebStorageService,
      public common: CommonMethodsService,
      private activatedRoute: ActivatedRoute,
      public encryptdecrypt: AesencryptDecryptService,
      private route:Router
    ) { }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.activatedRoute.queryParams.subscribe((params:any)=>{
     this.routingData = params['id'];
    })
    let spliteUrl = this.encryptdecrypt.decrypt(`${decodeURIComponent(this.routingData)}`).split('.');
    this.beneficieryId = spliteUrl[0]; 
    this.getProfileData();
  }

  getProfileData() {
    this.apiService.setHttp('GET', `sericulture/api/Beneficiery/GetBeneficieryDataById?Id=3&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.profileData = res.responseData;
        } else {
          this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : '';
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err.status);
      },
    });
  }

  backToList(){
    this.route.navigate(['beneficiery-list'])
  }
}
