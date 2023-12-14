import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficieryComponent } from './beneficiery.component';

const routes: Routes = [{ path: '', component: BeneficieryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficieryRoutingModule { }
