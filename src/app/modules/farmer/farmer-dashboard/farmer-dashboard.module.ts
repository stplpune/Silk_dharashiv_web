import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmerDashboardRoutingModule } from './farmer-dashboard-routing.module';
import { FarmerDashboardComponent } from './farmer-dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    FarmerDashboardComponent
  ],
  imports: [
    CommonModule,
    FarmerDashboardRoutingModule,
    MatButtonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule, TranslateModule, NgxMatSelectSearchModule
  ]
})
export class FarmerDashboardModule { }
