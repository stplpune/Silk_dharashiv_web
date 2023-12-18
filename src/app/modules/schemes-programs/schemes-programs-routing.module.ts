import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchemesProgramsComponent } from './schemes-programs.component';

const routes: Routes = [{ path: '', component: SchemesProgramsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemesProgramsRoutingModule { }
