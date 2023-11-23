import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmersignupComponent } from './farmersignup.component';

const routes: Routes = [{ path: '', component: FarmersignupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmersignupRoutingModule { }
