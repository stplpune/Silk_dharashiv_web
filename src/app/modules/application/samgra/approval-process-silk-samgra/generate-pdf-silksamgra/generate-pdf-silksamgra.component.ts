import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-generate-pdf-silksamgra',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule,],
  templateUrl: './generate-pdf-silksamgra.component.html',
  styleUrls: ['./generate-pdf-silksamgra.component.scss']
})
export class GeneratePdfSilksamgraComponent {

  priorArray:any;
  loginData:any;
  constructor
  (
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    private commonMethod: CommonMethodsService,
    private errorHandler: ErrorHandlingService,
    private web: WebStorageService,
  ){}

  ngOnInit(){
    this.loginData=this.web.getLoggedInLocalstorageData();    
    this.getSanctionLetterData();
  }

  getSanctionLetterData() { // prior letter
    this.spinner.show();
    this.apiService.setHttp('GET', 'sericulture/api/PriorApprovalLetter/GetPriorApprovalData?Id=1&CreatedBy='+this.web.getStateId(), false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.priorArray=res.responseData;
          console.log(' this.priorArray', this.priorArray);
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
