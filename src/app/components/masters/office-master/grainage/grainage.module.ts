import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrainageRoutingModule } from './grainage-routing.module';
import { GrainageComponent } from './grainage.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { AddGrainageComponent } from './add-grainage/add-grainage.component';


@NgModule({
  declarations: [
    GrainageComponent,
    AddGrainageComponent
  ],
  imports: [
    CommonModule,
    GrainageRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
  ]
})
export class GrainageModule { }
