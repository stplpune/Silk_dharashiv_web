import { Component } from '@angular/core';
import { AadhaarNoValComponent } from './aadhaar-no-val/aadhaar-no-val.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss']
})
export class FarmerDashboardComponent {
  schemeDataArray: any;
  lang: any;
  subscription!: Subscription;//used  for lang conv

  constructor(public dialog: MatDialog, private apiService: ApiService, private WebStorageService: WebStorageService,
    private spinner: NgxSpinnerService, private errorService: ErrorHandlingService) {
    this.getSchemeData();

    this.subscription = this.WebStorageService.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'English';
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    });
  }

  aadhaarNoVal(schemeId: any) {
    let obj = { schemeId: schemeId, obj: this.schemeDataArray }
    this.dialog.open(AadhaarNoValComponent, {
      width: '900px',
      data: obj,
    });
  }

  getSchemeData() {
    this.apiService.setHttp('GET', 'sericulture/api/Scheme/get-All-Scheme?PageNo=1' + '&PageSize=10', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.show();
        if (res.statusCode == '200') {
          this.schemeDataArray = res?.responseData.filter((ele: any) => ele?.isActive);
          this.spinner.hide();
        } else {
          this.schemeDataArray = []
        }
      }),
      error: (err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err.status)
      }
    })
  }
}
