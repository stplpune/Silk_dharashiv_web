import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficieryListRoutingModule } from './beneficiery-list-routing.module';
import { BeneficieryListComponent } from './beneficiery-list.component';


@NgModule({
  declarations: [
    BeneficieryListComponent
  ],
  imports: [
    CommonModule,
    BeneficieryListRoutingModule
  ]
})
export class BeneficieryListModule { }
