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


@NgModule({
  declarations: [
    ManaregaComponent
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
  ]
})
export class ManaregaModule { }
