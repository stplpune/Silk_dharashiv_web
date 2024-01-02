import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
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

  // displayedColumns: string[] = ['srNo','lotNumber', 'raceType', 'distributionChawki', 'ledDate','hatchingDate','deliveryDate']; 
  constructor(
    public webStorage: WebStorageService,
    public dialogRef: MatDialogRef<ChowkiOrderDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log("data", this.data);
    this.subscription = this.webStorage.setLanguage.subscribe((res: any) => {
      this.lang = res ? res : (localStorage.getItem('language') ? localStorage.getItem('language') : 'English');
      this.lang = this.lang == 'English' ? 'en' : 'mr-IN';
    })
  }

  viewReceipt() {
    window.open(this.data?.billPhoto)
  }

}
