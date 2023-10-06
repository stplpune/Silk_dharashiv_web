import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentLevelsRoutingModule } from './department-levels-routing.module';
import { DepartmentLevelsComponent } from './department-levels.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalTableComponent } from 'src/app/shared/global-table/global-table.component';
// import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DepartmentLevelsComponent
  ],
  imports: [
    CommonModule,
    DepartmentLevelsRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    GlobalTableComponent


  ]
})
export class DepartmentLevelsModule { }
