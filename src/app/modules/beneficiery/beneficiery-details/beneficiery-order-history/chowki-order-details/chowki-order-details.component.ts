import { Component } from '@angular/core';
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
  chowkiOrderData :any

  constructor(
    public webStorage: WebStorageService,
    public common: CommonMethodsService,
    private apiService: ApiService,
    private errorService: ErrorHandlingService
  ) { }
  ngOnInit() {

    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';    
    })   
    this.getChowkiOrderDetails();
   
  }

  getChowkiOrderDetails() {
    this.apiService.setHttp('GET', `sericulture/api/Beneficiery/GetBeneficieryChawkiOrderById?Id=2&lan=en `, false, false, false, 'masterUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.chowkiOrderData = res.responseData;   
        console.log("this.chowkiOrderData", this.chowkiOrderData);
             
      },
      error: (err: any) => {
        this.errorService.handelError(err.status);
      },
    });
  }


}
