import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrainageComponent } from './grainage.component';

const routes: Routes = [{ path: '', component: GrainageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrainageRoutingModule { }
