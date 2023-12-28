import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AesencryptDecryptService } from 'src/app/core/services/aesencrypt-decrypt.service';

@Component({
  selector: 'app-beneficiery-profile',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule],
  templateUrl: './beneficiery-profile.component.html',
  styleUrls: ['./beneficiery-profile.component.scss']
})
export class BeneficieryProfileComponent {
  subscription!: Subscription;
  lang: string = 'English';
  profileData: any;
  beneficieryId :any;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorHandlingService,
    public webStorage: WebStorageService,
    public common: CommonMethodsService,
    private activatedRoute: ActivatedRoute,
    public encryptdecrypt: AesencryptDecryptService) { 
      let Id: any;
      this.activatedRoute.queryParams.subscribe((queryParams: any) => { Id = queryParams['id'] });
      if(Id){
        this.beneficieryId =  this.encryptdecrypt.decrypt(`${decodeURIComponent(Id)}`)
        
    }
  }

  ngOnInit() {
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
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
}
