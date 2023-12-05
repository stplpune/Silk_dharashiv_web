
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-technical-estimate',
  templateUrl: './technical-estimate.component.html',
  styleUrls: ['./technical-estimate.component.scss'],
  imports: [CommonModule,RouterLink, MatCardModule, MatButtonModule]
})
export class TechnicalEstimateComponent {
  tableDataArray = new Array();
  subscription!: Subscription;
  lang: string = 'English';
  constructor
    (
      private spinner: NgxSpinnerService,
      private apiService: ApiService,
      private commonMethod: CommonMethodsService,
      private errorHandler: ErrorHandlingService,
      private WebStorageService: WebStorageService,
    ) { }

  ngOnInit() {
    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getEstimateData();
  }

  // api/TechnicalEstimate/Insert-Technical-Estimate1?ApplicationId=2&lan=en
  getEstimateData() {
    this.apiService.setHttp('GET', 'api/TechnicalEstimate/Insert-Technical-Estimate1?ApplicationId=2&lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.tableDataArray = res.responseData2;
          console.log('this.tableDataArray',this.tableDataArray);
          
        } else {
          this.spinner.hide();
          this.commonMethod.checkDataType(res.statusMessage) == false ? this.errorHandler.handelError(res.statusCode) : '';
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorHandler.handelError(err.status);
      },
    });
  }


}
