import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ChowkiOrderDetailsComponent } from 'src/app/modules/crc-list/crc-center-details/crc-chawki-order/chowki-order-details/chowki-order-details.component';

@Component({
  selector: 'app-silk-sell-details',
  templateUrl: './silk-sell-details.component.html',
  styleUrls: ['./silk-sell-details.component.scss']
})
export class SilkSellDetailsComponent {
  subscription!: Subscription;
  lang: string = 'English';
  silkSellData = new Array();

  constructor(
    public webStorage: WebStorageService,
    private spinner: NgxSpinnerService,
    private apiService: ApiService,
    public common: CommonMethodsService,
    private errorService: ErrorHandlingService,
    public dialogRef: MatDialogRef<ChowkiOrderDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log("data", this.data);
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
    this.getSilkSellData();
  }

  getSilkSellData() {
    this.spinner.show();
    this.apiService.setHttp('GET', `sericulture/api/SilkSell/GetSilkSellDetails?FarmerId=0&Id=${this.data}&lan=${this.lang}`, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == '200') {
          this.silkSellData = res.responseData1;
        } else {
          this.common.checkDataType(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : '';
          this.spinner.hide();
          this.silkSellData = [];
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err.status);
      },
    });
  }

  viewReceipt() {
    window.open(this.data?.billPhoto)
  }
}
