import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketsRoutingModule } from './markets-routing.module';
import { MarketsComponent } from './markets.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AddMarketListComponent } from './add-market-list/add-market-list.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GlobalTableComponent } from 'src/app/shared/global-table/global-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    MarketsComponent,
    AddMarketListComponent
  ],
  imports: [
    CommonModule,
    MarketsRoutingModule,
       MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatNativeDateModule,
    GlobalTableComponent,
    MatDatepickerModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MarketsModule { }
