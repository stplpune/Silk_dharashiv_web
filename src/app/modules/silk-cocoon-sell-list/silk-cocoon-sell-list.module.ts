import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SilkCocoonSellListRoutingModule } from './silk-cocoon-sell-list-routing.module';
import { SilkCocoonSellListComponent } from './silk-cocoon-sell-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    SilkCocoonSellListComponent
  ],
  imports: [
    CommonModule,
    SilkCocoonSellListRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    GlobalTableComponent,
    MatNativeDateModule, MatDatepickerModule,
  ]
})
export class SilkCocoonSellListModule {

 }
