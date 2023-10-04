import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketRateRoutingModule } from './market-rate-routing.module';
import { MarketRateComponent } from './market-rate.component';


@NgModule({
  declarations: [
    MarketRateComponent
  ],
  imports: [
    CommonModule,
    MarketRateRoutingModule
  ]
})
export class MarketRateModule { }
