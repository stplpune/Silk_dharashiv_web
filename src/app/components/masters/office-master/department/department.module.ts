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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalTableComponent } from 'src/app/shared/global-table/global-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddDepartmentComponent } from './add-department/add-department.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    DepartmentComponent,
    AddDepartmentComponent
  ],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    GlobalTableComponent,
    TranslateModule
  ]
})
export class DepartmentModule { }
