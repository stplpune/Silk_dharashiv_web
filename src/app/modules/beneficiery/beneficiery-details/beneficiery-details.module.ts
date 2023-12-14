import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficieryDetailsRoutingModule } from './beneficiery-details-routing.module';
import { BeneficieryDetailsComponent } from './beneficiery-details.component';
import { BeneficieryProfileComponent } from './beneficiery-profile/beneficiery-profile.component';
import { BeneficieryApplicationHistoryComponent } from './beneficiery-application-history/beneficiery-application-history.component';
import { BeneficieryOrderHistoryComponent } from './beneficiery-order-history/beneficiery-order-history.component';
import { BeneficierySilkSellHistoryComponent } from './beneficiery-silk-sell-history/beneficiery-silk-sell-history.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ChowkiOrderDetailsComponent } from './beneficiery-order-history/chowki-order-details/chowki-order-details.component';


@NgModule({
  declarations: [
    BeneficieryDetailsComponent,
    ChowkiOrderDetailsComponent,

  ],
  imports: [
    CommonModule,
    BeneficieryDetailsRoutingModule,
    MatTabsModule,
    BeneficieryProfileComponent,
    BeneficieryApplicationHistoryComponent,
    BeneficieryOrderHistoryComponent,
    BeneficierySilkSellHistoryComponent,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class BeneficieryDetailsModule { }
