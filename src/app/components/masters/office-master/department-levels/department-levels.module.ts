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
    MatButtonModule
  ]
})
export class DepartmentLevelsModule { }
