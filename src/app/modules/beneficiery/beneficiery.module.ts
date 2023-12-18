import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficieryRoutingModule } from './beneficiery-routing.module';
import { BeneficieryComponent } from './beneficiery.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    BeneficieryComponent
  ],
  imports: [
    CommonModule,
    BeneficieryRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    GlobalTableComponent,
    TranslateModule
  ]
})
export class BeneficieryModule { }
