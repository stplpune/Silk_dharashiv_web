import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketRateRoutingModule } from './market-rate-routing.module';
import { MarketRateComponent } from './market-rate.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
// import { AddMarketRateComponent } from './add-market-rate/add-market-rate.component';


@NgModule({
  declarations: [
    MarketRateComponent,
    // AddMarketRateComponent
  ],
  imports: [
    CommonModule,
    MarketRateRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    GlobalTableComponent,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class MarketRateModule { }
