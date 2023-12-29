import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorHandlingService } from 'src/app/core/services/error-handling.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-chowki-order-details',
  templateUrl: './chowki-order-details.component.html',
  styleUrls: ['./chowki-order-details.component.scss']
})
export class ChowkiOrderDetailsComponent {
  subscription!: Subscription;
  lang: string = 'English';
  chowkiOrderData :any;
  dataSource : any;
  displayedColumns: string[] = ['srNo','lotNumber', 'raceType', 'distributionChawki', 'ledDate','hatchingDate','deliveryDate']; 
  constructor(
    public webStorage: WebStorageService,
    public common: CommonMethodsService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService,
    public dialogRef: MatDialogRef<ChowkiOrderDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit() {

    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';    
    })   
    this.getChowkiOrderDetails();
   
  }

  getChowkiOrderDetails() {
    this.apiService.setHttp('GET', 'sericulture/api/Beneficiery/GetBeneficieryChawkiOrderById?Id='+this.data?.id+'&lan='+this.lang, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.chowkiOrderData = res.responseData;   
        // let tableArray = new Array();
        this.dataSource = res.responseData.deliveryDetails
     
      },
      error: (err: any) => {
        this.errorService.handelError(err.status);
      },
    });
  }

  viewReceipt(){
    window.open(  this.chowkiOrderData?.receiptOfPaymentPath)
  }


}
