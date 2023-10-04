import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentLevelsRoutingModule } from './department-levels-routing.module';
import { DepartmentLevelsComponent } from './department-levels.component';


@NgModule({
  declarations: [
    DepartmentLevelsComponent
  ],
  imports: [
    CommonModule,
    DepartmentLevelsRoutingModule
  ]
})
export class DepartmentLevelsModule { }
