import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './department.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class DepartmentModule { }
