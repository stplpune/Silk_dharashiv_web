import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficieryDetailsRoutingModule } from './beneficiery-details-routing.module';
import { BeneficieryDetailsComponent } from './beneficiery-details.component';
import { BeneficieryProfileComponent } from './beneficiery-profile/beneficiery-profile.component';
import { BeneficieryApplicationHistoryComponent } from './beneficiery-application-history/beneficiery-application-history.component';
import { BeneficieryOrderHistoryComponent } from './beneficiery-order-history/beneficiery-order-history.component';
import { BeneficierySilkSellHistoryComponent } from './beneficiery-silk-sell-history/beneficiery-silk-sell-history.component';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    BeneficieryDetailsComponent,

  ],
  imports: [
    CommonModule,
    BeneficieryDetailsRoutingModule,
    MatTabsModule,
    BeneficieryProfileComponent,
    BeneficieryApplicationHistoryComponent,
    BeneficieryOrderHistoryComponent,
    BeneficierySilkSellHistoryComponent
  ]
})
export class BeneficieryDetailsModule { }
