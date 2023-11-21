import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketRateComponent } from './market-rate.component';

const routes: Routes = [{ path: '', component: MarketRateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRateRoutingModule { }
