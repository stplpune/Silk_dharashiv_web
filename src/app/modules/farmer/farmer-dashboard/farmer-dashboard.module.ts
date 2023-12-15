import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmerDashboardRoutingModule } from './farmer-dashboard-routing.module';
import { FarmerDashboardComponent } from './farmer-dashboard.component';


@NgModule({
  declarations: [
    FarmerDashboardComponent
  ],
  imports: [
    CommonModule,
    FarmerDashboardRoutingModule
  ]
})
export class FarmerDashboardModule { }
