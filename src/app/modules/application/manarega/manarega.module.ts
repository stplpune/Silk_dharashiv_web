import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManaregaRoutingModule } from './manarega-routing.module';
import { ManaregaComponent } from './manarega.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalTableComponent } from 'src/app/shared/components/global-table/global-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';



@NgModule({
  declarations: [
    ManaregaComponent,
  ],
  imports: [
    CommonModule,
    ManaregaRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalTableComponent,
    TranslateModule,
    NgxMatSelectSearchModule,

  ]
})
export class ManaregaModule { }
