import { Component } from '@angular/core';
import { AadhaarNoValComponent } from './aadhaar-no-val/aadhaar-no-val.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss']
})
export class FarmerDashboardComponent {
  schemeDataArray: any;


  constructor(public dialog: MatDialog, private apiService: ApiService,
    private spinner: NgxSpinnerService, private errorService: ErrorHandlingService) {
    this.getSchemeData();
  }

  aadhaarNoVal(schemeId: any) {
    let obj = { schemeId: schemeId, obj: this.schemeDataArray }
    this.dialog.open(AadhaarNoValComponent, {
      width: '700px',
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
