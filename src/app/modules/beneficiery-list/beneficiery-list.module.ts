import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficieryListRoutingModule } from './beneficiery-list-routing.module';
import { BeneficieryListComponent } from './beneficiery-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    BeneficieryListComponent
  ],
  imports: [
    CommonModule,
    BeneficieryListRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class BeneficieryListModule { }
