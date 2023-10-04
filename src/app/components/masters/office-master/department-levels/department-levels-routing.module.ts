import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentLevelsComponent } from './department-levels.component';

const routes: Routes = [{ path: '', component: DepartmentLevelsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentLevelsRoutingModule { }
